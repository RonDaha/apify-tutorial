# Apify Tutorial SDK - Ron Dahan

### Task 2
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

### Task 3

- How do you allocate more CPU for your actor run?
    - From the Dashboard on the Apify platform under the ‘Actors’ tab, we can choose settings -> Default run options -> Memory. By changing this value we can allocate more CPU to our actor. We can also configure that when calling an actor from the Apify API and pass the Memory property in the payload. And by calling an Actor from thee SDK we can configure the memoryMbytes on the configuration object we pass to thee Apify.call method.

- How can you get the exact time when the actor was started from within the running actor process?
    - By using Apify.getEnv method we receive an object that contain the property startedAt which reflect the time the actor started

- Which are the default storages an actor run is allocated (connected to)?
    - Each actor run is associated with a default key-value store, dataset, and request queue which is created exclusively for the actor run.

- Can you change the memory allocated to a running actor?
    - I did not find an option to change the memory allocated to a running actor, which also make since it won’t be. So my answer is that it’s cannot be done. We can preconfigure the Autoscale pool to use More memory if needed but that’s something we need to configure in advance before we run the actor. In that case the Actor will bee able to use more memory if needed.

- How can you run an actor with Puppeteer in a headful (non-headless) mode?
    - If wee run the Actor locally on our machine we can run the Puppeteer in a heedful mode. On thee Apify platform we will need to use the ‘Node.js 12 + Chrome + Xvfb on Debian’ Docker image to create the container our Actor will be run in.

- Imagine the server/instance the container is running on has a 32 GB, 8-core CPU. What would be the most performant (speed/cost) memory allocation for CheerioCrawler? (Hint: NodeJS processes cannot use user-created threads)
    - Since the Actor will be using all of it’s available memory when running on the Apify platform, according to your example from the ‘Getting Started’ section, That with 4 GBs of memory and a single CPU core, you can scrape 500 or more pages a minute with CheerioCrawler. If we double it by 8 then wee can scrape 4,000 pages within a minute. If it runs on a local machine with this amount of memory it will be using 1/4 of it. Which will be 1,000 pages for a minute

#### Docker 

- What is the difference between RUN and CMD Dockerfile commands?
  - RUN is an image build step, the state of the container after a RUN command will be committed to the container image
  - CMD is the command the container executes by default when you launch the built image

- Does your Dockerfile need to contain a CMD command (assuming we don't want to use ENTRYPOINT which is similar)? If yes or no, why?
    - The CMD command is necessary for running a container. So we will have to use it unless we extending a base image that's already running the application automatically

- How does the FROM command work and which base images Apify provides?

- The FROM instruction initializes a new build stage and sets the Base Image for subsequent instructions.
    The base images provided by Apify are
    1. Node.js 12 on Alpine Linux (apify/actor-node-basic)
    2. Node.js 12 + Chrome on Debian (apify/actor-node-chrome)
    3. Node.js 12 + Chrome + Xvfb on Debian (apify/actor-node-chrome-xvfb)
    4. Node.js 10 + Puppeteer on Debian (apify/actor-node-puppeteer). Which are deprecated
    

### Task 4

- Do you have to rebuild an actor each time the source code is changed?
  - We can use a cached layers within our build process, but we still have to rebuild each time source code is changed for the docker container will be created from the latest image and includes our new changes

- What is the difference between pushing your code changes and creating a pull request?
    -  When we're pushing our code from our local machine to the remote git server we are updating the current branch we are working on. when creating a pull request we ask to push code from on a branch to another (on the remote git repository)   
- How does the apify push command work? Is it worth using, in your opinion?
    - The apify push command uploads our project to the Apify cloud and builds an actor from it. In my option in is a great tool and worth using. On development process it will be faster to test changes like that. If we think 'production' environment it will be smarter to manage it from git to make sure our actor will be updated only when the master branch will.     


