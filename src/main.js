/**
 *
 */

const Apify = require('apify')
const { handleMainPage, handleProductDetailsPage, handleProductsOffersPage } = require('./routes')
const { PageLabels, Datasets, Debugging } = require('./consts')
const { generateRand } = require('./utils')
const { utils } = Apify

const { utils: { log } } = Apify

Apify.main(async () => {
    console.time(Debugging.TIME)
    const { keyword } = await Apify.getInput()
    const mainPageUrl = `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${keyword}`
    const requestList = await Apify.openRequestList('search-product-url', [{ url: mainPageUrl }])
    const requestQueue = await Apify.openRequestQueue()
    let proxyConfiguration
    let emailTo = 'roncho1794@gmail.com'
    // Use Proxies on the Apify platform only
    if (Apify.isAtHome()) {
        emailTo = 'lukas@apify.com'
        proxyConfiguration = await Apify.createProxyConfiguration()
    }

    Apify.isAtHome()
    const crawler = new Apify.PuppeteerCrawler({
        proxyConfiguration,
        requestList,
        requestQueue,
        maxConcurrency: 10,
        useSessionPool: true,
        persistCookiesPerSession: true,
        launchPuppeteerOptions: {
            useChrome: true,
            stealth: true,
        },
        handlePageFunction: async (context) => {
            const { url, userData: { label } } = context.request
            log.info('Page opened.', { label, url })
            // Generate random number to wait. Try to be less detectable as bot
            await utils.sleep(generateRand() * 1000)
            switch (label) {
                case PageLabels.DETAILS:
                    return handleProductDetailsPage(context, requestQueue)
                case PageLabels.OFFERS:
                    return handleProductsOffersPage(context, keyword)
                default:
                    return handleMainPage(context, requestQueue)
            }
        },
    })

    log.info('Starting the crawl.')
    await crawler.run()
    const dataset = await Apify.openDataset(Datasets.AMAZON_PRODUCTS, { forceCloud: true })
    const dataUrl = `https://api.apify.com/v2/datasets/${dataset.datasetId}/items?clean=true&format=html`
    log.info('Crawl finished. Calling Send Email Actor')
    await Apify.call('apify/send-mail', {
        to: emailTo,
        subject: 'This is for the Apify SDK exercise - Ron Dahan',
        text: `Data results for - ${keyword}.\nDataset URL - ${dataUrl}`,
    })
    log.info('Email sent. Process is done')
    console.timeEnd(Debugging.TIME)
})
