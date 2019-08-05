# Apify Puppeteer Crawler

## Brief Description
A web crawler that parses and paginates through data describing upcoming events in Houston, TX.

## Instructions
After either downloading the zip, or cloning the repo, `cd` into the project directory and run `npm install`. 

#### `main.js` to scrape and paginate through several events

In order to use the Puppeteer Crawler and parse / paginate through data within the Houston Events pages run `node main.js` in a termnial. A directory in the project root named, `apify_storage` should generate and the scraped data output should print out in `apify_storage/datasets/default` as `.JSON` files starting at `0.000000001.json`.

#### `main.js` on an Individual Event Page
To see how the scraping can work on an individual event page, replace the `requestQue` url with the provided link in line 7. Uncomment the `querySelectors` of the `forEach` loop starting on line 28 and comment out the `querySelectors` that were being used to populate the data of the event pages. Use the `data` function on line 61 instead of the function on 58. 


### Troubleshooting
While testing out `main.js`, if the crawler doesn't fire up the Chromium browser, peek inside of `apify_storage/request_quueues/default/handled` and delete the JSON files inside. Try running `main.js` and things should run smoothly.