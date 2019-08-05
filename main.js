const Apify = require('apify');

Apify.main(async () => {

  const requestQueue = await Apify.openRequestQueue();

  // Use https://www.visithoustontexas.com/event/zumba-in-the-plaza/59011/ in conjunction
  // with the commented out query selectors in the pageFunction forEach to scrape more detailed data.
  await requestQueue.addRequest({ url: `https://www.visithoustontexas.com/events/` });


  const crawler = new Apify.PuppeteerCrawler({
      
    requestQueue,
    maxRequestsPerCrawl: 10,

    handlePageFunction: async ({ request, page }) => {
        
      console.log(`PROCESSING ${request.url}...   💭   🤔`);

      const pageFunction = $events => {
        const data = [];
        
        $events.forEach($event => {
          data.push({

            /** For Individual Pages like https://www.visithoustontexas.com/event/zumba-in-the-plaza/59011/ */
            /*
            title: $event.querySelector('.detail-c2 h1').innerText,
            href: $event.querySelector('link[rel="canonical"]').href,
            description: $event.querySelector('.description p').innerText,
            dates: $event.querySelector('.dates').innerText,
            times: $event.querySelector('.detail-c2 div:nth-child(8)').innerText,
            recurring: $event.querySelector('.dates ~ .dates:nth-of-type(2)').innerText,
            location: $event.querySelector('.location').innerText,
            address: $event.querySelector('.adrs').innerText,
            contact: $event.querySelector('.detail-c2 div:nth-child(6)').innerText,
            phone: $event.querySelector('.detail-c2 div:nth-child(7)').innerText,
            admission: $event.querySelector('.detail-c2 div:nth-child(9)').innerText,
            timestamp: + new Date(),
            */
            
            /** Limited Data For Events Pages: https://www.visithoustontexas.com/events/ */
            title: $event.querySelector('.title a').innerText,
            url: $event.querySelector('.title a').href,
            description: $event.querySelector('.desc').innerText,
            dates: $event.querySelector('.dates').innerText,
            address: $event.querySelector('.adrs').innerText,
            
          });
        });

        return data;

      };

      // Parse through the event data when Each Individual eventItem renders
      const data = await page.$$eval('.eventItem', pageFunction);

      // Set to evaluate a fully rendered .contentWrapper when scraping individual event pages
      //const data = await page.$$eval('html', pageFunction);

      // Store the results to the default dataset.
      await Apify.pushData(data);

      // Find a link to the next page and enqueue it if it exists.
      const paginationFunction = await Apify.utils.enqueueLinks({
        page,
        requestQueue,
        selector: '.next'
      });
    },

    // This function is called if the page processing failed more than maxRequestRetries+1 times.
    handleFailedRequestFunction: async ({ request }) => {
      console.log(`Request ${request.url} failed too many times`);
      await Apify.pushData({
        '#debug': Apify.utils.createRequestDebugInfo(request),
      });
    },
  });

  await crawler.run();

  console.log('Crawler finished.    ✅');
});