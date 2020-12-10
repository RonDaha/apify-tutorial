# Tutorial II Apify SDK - Ron Dahan

- Where and how can you use JQuery with the SDK?
    - When instantiating an instance of CheerioCrawler, the second argument that will pass to the handlePageFunction will be the `$`, this provided by the Cheerio library and expose the familiar jQuery API that can be used inside the handlePageFunction. This is not the actual jQuery library, but the Cheerio library that expose for use the same jQuery API for node.js environment

- What is the main difference between Cheerio and JQuery?
    - Unlike jQuery, Cheerio doesn't have access to the browser’s DOM. Instead, we need to load the source code of the webpage we want to crawl. Cheerio allows us to load HTML code as a string, which we able manipulate with the jQuery API.

- When would you use CheerioCrawler and what are its limitations?
    - CheerioCrawler will be a better solution when you need to do extremely high workloads, and you do not need to do any manipulation of the website before or while scraping. Since most of the modern websites uses Javascript to change the content according to the user behiover, one of the biggest limitations of the CheerioCrawler is that you can only parse the website as stringified html that we retrieve from an HTTP request. So if parsing the DOM content as static html string is good solution for our needs, CheerioCrawler would be the best solution to crawl the website and extracting the relevant data with the built in jQuery-like api.

- What are the main classes for managing requests and when and why would you use one instead of another?
    - The base class we will use is the Request class which can hold a lot of information regarding the request we want to perform. Must include the URL - the web page we want to open.
      For managing our requests we have the RequestList class, and the RequestQueue class.
      The RequestList - a per-existing static Immutable list of Requests which our crawler will visit one by one until there are no more Requests to process.
      The RequestQueue - represents a dynamic queue of Requests, could be updated at runtime by adding more Requests instances to process.
      When you know in advance what are the pages you want to visit you should choose the RequestList to manage your Requests instances, on the other hand if you do not know all the pages you want to visit before you run the crawling process you should use the RequestQueue and add pages on the go according to the data you aim to find.
      Of course, as I did on this exercise we can use both.

- How can you extract data from a page in Puppeteer without using JQuery?
    - When creating a PuppeteerCrawler instance, on the handlePageFunction we pass as parameter we do not have out of the box the jQuery api. We could simply use plain Javascript to extract the relevant data and manipulate the DOM as we like. We could also inject a script tag with src to a CDN for an external library we want to use to improve our crawling process (which could be also jQuery). Using the `page` parameter which will be pass to the handlePageFunction we can use the Puppeteer api to access the DOM with one of the many exposed methods 
    

- What is the default concurrency/parallelism the SDK uses?
    - Followed the AutoscaledPool configuration API, the default value of the desired concurrency would be the default value of the min concurrency which will be 1 at a time. This is configurable and can scale up and down according to our needs and CPU available we can use.