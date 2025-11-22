import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

// URL of the website to scrape
const targetURL = 'https://www.eventbrite.com/ttd/ny--new-york/';

async function scrapeEvents() {
  try {
    const response = await axios.get(targetURL);
    const html = response.data;

    const $ = cheerio.load(html);
    const eventItems = $('.eds-event-card-content__content-container');
    const eventData = [];

    eventItems.each((index, element) => {
        const container = $(element);

        // Title
        const title = container
            .find('.eds-event-card__formatted-name--is-clamped')
            .text()
            .trim();

        // Date
        const date = container
            .find('.eds-event-card-content__sub-title')
            .text()
            .trim();

        // sub text  to extract location, cost, host, followers
        const subText = container
            .find('.eds-event-card-content__sub')
            .text()
            .replace(/\s+/g, ' ') // whitespace
            .trim();
        let location = '';
        let cost = 'Free';
        let host = '';
        let followers = '';

        // Cost
        const costMatch = subText.match(/Starts at \$[\d.,]+/i);
        if (costMatch){
            cost = costMatch[0];
        }
        else if (/Free/i.test(subText)) {
            cost = 'Free';
        }      

        // Followers
        const followersMatch = subText.match(/[\d,.]+ followers/i);
        if (followersMatch) {
            followers = followersMatch[0];
        }

        // Host
        if (costMatch && followersMatch) {
            const start = subText.indexOf(costMatch[0]) + costMatch[0].length;
            const end = subText.indexOf(followersMatch[0]);
            host = subText.slice(start, end).trim();
        }

        // Location
        const locationMatch = subText.match(/[A-Za-z\s]+ • [A-Za-z\s]+, [A-Z]{2}/);
        if (locationMatch) location = locationMatch[0];

        // Link
        const link = container
            .find('a.eds-event-card-content__action-link')
            .attr('href');

        eventData.push({ title, date, location, cost, host, followers, link });
    });

    // Save to JSON
    fs.writeFileSync('events.json', JSON.stringify(eventData, null, 2));
    console.log(`Scraped ${eventData.length} events and saved to events.json`);

  } catch (err) {
    console.error('Error scraping events:', err);
  }
}

scrapeEvents();

// // To run the script: 
// /**
//  * Navigate to scraper dir:
//  *     cd website/scraper
//  * 
//  * Install dependencies:
//  *    npm install axios cheerio
//  * 
//  * Run the script:
//  *   node index.js
//  *     
//  */
// // Scrapping tutorial reference: https://medium.com/@datajournal/web-scraping-with-cheerio-0f16371a16a4

