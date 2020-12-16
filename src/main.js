/*
 * Amazon Actor - responsible to scrape data from amazon by searching a certain keyword.
 * */
const Apify = require('apify')
const { handleMainPage, handleProductDetailsPage, handleProductsOffersPage } = require('./routes')
const { PageLabels, Debugging, StorageKeys } = require('./consts')
const { generateRand } = require('./utils')
const { utils: { log } } = Apify

Apify.main(async () => {
    console.time(Debugging.TIME)
    const { keyword } = await Apify.getInput()
    const mainPageUrl = `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${keyword}`
    const requestList = await Apify.openRequestList('search-product-url', [{ url: mainPageUrl }])
    const requestQueue = await Apify.openRequestQueue()
    let proxyConfiguration
    if (Apify.isAtHome()) {
        proxyConfiguration = await Apify.createProxyConfiguration({ groups: ['BUYPROXIES94952']})
    }

    const crawler = new Apify.PuppeteerCrawler({
        proxyConfiguration,
        requestList,
        requestQueue,
        maxConcurrency: 1,
        useSessionPool: true,
        launchPuppeteerOptions: {
            useChrome: true,
            stealth: true,
        },
        handlePageFunction: async (context) => {
            const { url, userData: { label } } = context.request
            const { page, session } = context
            log.info('Page opened.', { label, url })

            const title = await page.title();
            // meaning we got into captcha, blocked Or we made more then 5 requests with this session.
            if (title === 'Sorry! something went wrong!' || title.includes('validate') || title.includes('block') || session.usageCount >= 5) {
                log.info('Killing session')
                session.retire()
            }

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

    // Log the current state every 20 seconds
    setInterval(async () => {
        const store = await Apify.openKeyValueStore();
        const state = await store.getValue(StorageKeys.STATE)
        log.info('Current state:')
        console.log(state)
    }, 20000)


    log.info('Starting the crawl.')
    await crawler.run()
    log.info('Crawl finished.')
    console.timeEnd(Debugging.TIME)


    /* Tutorial part 1 */
    // const dataset = await Apify.openDataset()
    // const dataUrl = `https://api.apify.com/v2/datasets/${dataset.datasetId}/items?clean=true&format=html`
    // let emailTo = 'roncho1794@gmail.com'
    // if (Apify.isAtHome()) {
    //     emailTo = 'lukas@apify.com'
    // }
    // await Apify.call('apify/send-mail', {
    //     to: emailTo,
    //     subject: 'This is for the Apify SDK exercise - Ron Dahan',
    //     text: `Data results for - ${keyword}.\nDataset URL - ${dataUrl}`,
    // })
    // log.info('Email sent. Process is done')
})
