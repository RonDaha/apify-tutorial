const Apify = require('apify')
const { utils: { log } } = Apify
const { PageLabels, StorageKeys } = require('./consts')

/*
 The main page function will be responsible to collect all the product's ASIN from the main page
*/
exports.handleMainPage = async ({ request, page }, requestQueue) => {
    log.info('Main Page Start')
    const extractProductsAsin = products => {
        const productsAsinList = []
        for (const product of products) {
            // Take the 'data-asin' value from each product
            const productAsin = product.getAttribute('data-asin')
            if (productAsin) {
                productsAsinList.push(productAsin)
            }
        }
        return productsAsinList
    }
    // Collect all the products on the page
    const productsAsin = await page.$$eval('[data-asin]', extractProductsAsin)
    for (const asin of productsAsin) {
        const requestOptions = {
            url: `https://www.amazon.com/dp/${asin}`,
            userData: { label: PageLabels.DETAILS, asin },
        }
        // Feed the requestQueue with each product detail page
        await requestQueue.addRequest(requestOptions)
    }
    log.info(`Main Page Done, Enqueued ${productsAsin.length} products`)
}

/*
 Handled each product page to extract the relevant data
*/
exports.handleProductDetailsPage = async ({ request, page }, requestQueue) => {
    const productData = await page.evaluate(() => {
        const productTitleElement = document.getElementById('productTitle')
        const productDescriptionElement = document.getElementById('productDescription')
        return {
            title: productTitleElement ? productTitleElement.innerText : null,
            description: productDescriptionElement ? productDescriptionElement.innerText : null,
        }
    })
    productData.url = request.loadedUrl
    const requestOptions = {
        url: `https://www.amazon.com/gp/offer-listing/${request.userData.asin}`,
        userData: { label: PageLabels.OFFERS, asin: request.userData.asin, productData },
    }
    // Feed the requestQueue with each product offer page
    await requestQueue.addRequest(requestOptions)
    log.info(`Done to collect product - ${request.userData.asin}`)
}

/*
 Handled each product offer page to extract the relevant data
*/
exports.handleProductsOffersPage = async ({ request, page }, keyword) => {

    const productOffers = await page.$$eval('.olpOffer', offers => {
        const offersData = []
        offers.forEach(offer => {
            let sellerName = null
            const priceElement = offer.querySelector('.olpOfferPrice')
            const sellerElement = offer.querySelector('.olpSellerName')
            if (sellerElement) {
                // Take the image alt text in case the seller name will be display as image
                const sellerImgElement = sellerElement.querySelector('img')
                if (sellerImgElement) {
                    sellerName = sellerImgElement.alt
                } else {
                    sellerName = sellerElement.innerText
                }
            }
            offersData.push({
                price: priceElement ? priceElement.innerText : null,
                sellerName: sellerName,
            })
        })
        return offersData
    })


    // Renew the data on the key value store.
    const store = await Apify.openKeyValueStore();
    let previousState = await store.getValue(StorageKeys.STATE)
    previousState = previousState || {}
    const newState = { ...previousState, [request.userData.asin]: productOffers.length }
    await store.setValue(StorageKeys.STATE, newState);

    const finalData = productOffers.map( offer => {
        return {
            ...request.userData.productData,
            ...offer,
            keyword,
            asin: request.userData.asin,
            shippingPrice: 'Includes in price'
        }
    })
    const dataset = await Apify.openDataset()
    await dataset.pushData(finalData)
}
