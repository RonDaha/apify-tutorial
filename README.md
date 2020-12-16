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

### Task 5

- What is the relationship between actor and task?
    - Tasks are a feature that allow you to save pre-configured inputs for actors. An actor can perform a certain job with specific configurations for this job.

- What are the differences between default (unnamed) and named storage? Which one would you choose for everyday usage?
    - The differences between the two is that unnamed storage will be automatically deleted in 7 days. If we have few actors that do different things I will choose the named storages for 	an easier UI experience when I am browsing in my storages. Just need to remember to delete the data when it won’t be relevant anymore.

- What is the relationship between the Apify API and the Apify client? Are there any significant differences?
    - The Apify API exposes an API to integrate with the Apify platform, The Apify client make the API calls with exponential backoff, meaning it will retry util 8 times if the API calls fails.

- Is it possible to use a request queue for deduplication of product IDs? If yes, how would you do that?
    - Each request on the request queue got to have uniqueKey property, so to avoid duplications we can just set the uniqueKey of the request to be the product’s id

- What is data retention and how does it work for all types of storage (default and named)?
    - Data retention is the time our data will be save on the API platform. Unnamed storages expire after 7 days unless otherwise specified. Named storages are retained indefinitely

- How do you pass input when running an actor or task via the API?
    - By passing a JSON object as the POST payload and setting the Content-Type: application/json HTTP header.


### Task 6

- Which proxies (proxy groups) can users access with the Apify Proxy trial? How long does this trial last?
  -  The available proxies groups are - Google SERP proxy (up to 100 requests) and Datacenter proxies. The trial will last for 30 days.
  
- How can you prevent a problem that one of the hardcoded proxy groups that a user is using stops working (a problem with a provider)? What should be the best practices?
  - IP address rotation, we should keep rotate the IP we use for the same site according to it's blocking patterns

- Does it make sense to rotate proxies when you are logged in?
  - No, the IP represent the location the user is making the requests from so if we logged in to a website we need to keep the same IP for all our requests during this time the user is logged in.

- Construct a proxy URL that will select proxies only from the US (without specific groups)
  - http://<proxyServerUsername,country-US>:<proxyServerPassword>@proxy.test.com:8000

- What do you need to do to rotate proxies (one proxy usually has one IP)? How does this differ for Cheerio Scraper and Puppeteer Scraper?
  - To rotate an IP address we need to change our IP by choosing new IP from the pool. we can use sessions to manage that, create a new one if we wish to make the request from a different IP address
  - To a Puppeteer Scraper we will tread as a Browser – a different IP address is used for each browser, so we will keep the same proxy (IP address) for the lifetime for our browser instance.
  - To a Cheerio Scraper we will tread as new HTTP request each time – a different IP address is used for each request.
  
- Try to set up the Apify Proxy (using any group or auto) in your browser. This is useful for testing how websites behave with proxies from specific countries (although most are from the US). You can try Switchy Omega extension but there are many more. Were you successful?
  - I did try using this extension by using a free proxy server credentials. I visited a few websites i go to on a daily base
  
- Name a few different ways a website can prevent you from scraping it.
  - Block your IP address.
  - Website is analyzing your behavior
  - Websites can check for the signals that are been sent with the request (such as headers)
  - Track browser fingerprint

- Do you know any software companies that develop anti-scraping solutions? Have you ever encountered them on a website?
  - I actually never heard about specific company which develop anti-scraping solution and never encountered one of them. From a google search I read a little bit about Radware, ipqualityscore, 

### Task 7

- Actors have a Restart on error option in their Settings. Would you use this for your regular actors? Why? When would you use it, and when not?
  - I will not use the Restart on error option for my regular actor since an error is something my program should be ready for. If there are unexpected or unhandled error I will not want my actor to restart, I will want to investigate the error and prepare my actor to handle it well next time. Therefor this is not something I will use by default for every actor. I can think of a case I will use it where I want to test some website’s limits, so I won’t be afraid to receive errors from HTTP requests or if I am trying to scrape data from elements that appear only on certain cases. And also for testing data persistence just like in this task  
  
- Migrations happen randomly, but by setting Restart on error and then throwing an error in the main process, you can force a similar situation. Observe what happens. What changes and what stays the same in a restarted actor run?
  - I saw that a local variable that I used to test the persistent (simple counter) was started all over again from 0 since it was living during the lifetime of the container, hence when a new container created the counter value was 0 again.
  I also notice that the requestQueue kept its data and continue where it left before the manual error i emitted. The default key-value store from the first run (before the restart) also kept the same. in that way i was able to persist the relevant data for this task without naming this key-value store.

- Why don't you usually need to add any special code to handle migrations in normal crawling/scraping? Is there a component that essentially solves this problem for you?
  - The persistState event is emitted every 60 seconds by default. This event notifies all the components of the SDK to persist their state. It will also be emitted along with the migrating event but with isMigrating flag set to true.
  
- How can you intercept the migration event? How much time do you need after this takes place and before the actor migrates?
  - We can intercept by listen to the ‘migrating’ event which indicate the actor will migrate soon. Not sure regarding the amount of time I need before the migration take place, enough time to persist my relevant data.
  
- When would you persist data to a default key-value store and when would you use a named key-value store?
  - I will persist data to a default key-value store in case the data is relevant for the specific operation I am doing (actor / task run for example) to maintain long-running actor's state. To avoid losing this data in case of a migration.
    A named key-value will be use I case I want to save data for a long period of time, and also for easier tracking on the Apify platform UI

- Elaborate if you can ensure this object will stay 100% accurate, which means it will reflect the data in the dataset. Is this possible? If so, how?
  - Their are a kind of race condition when we try to log the key value data every 20 seconds, at the moment we are logging it there is maybe new record that being inserting at the moment. We could use the promise the `setValue` method return and save it 
  in accessible variable within the setInterval function. Then we can just await for it to finish before getting the value we want to log. 
