import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

//This script follows EventBrite layout to extract. So it doesnt work for other websites

// URL of the website to scrape
const targetURL = 'https://www.eventbrite.com/ttd/ny--new-york/';

async function scrapeEvents() {
  try {
    const response = await axios.get(targetURL);
    console.log("Fetching data from:", targetURL);
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
            .find('.eds-event-card-content__sub-title') //date subtitle
            .text()
            .trim();

        // sub text  to extract location, cost, host, followers
        const subText = container
            .find('.eds-event-card-content__sub') //next line of subtitle
            .text()
            .replace(/\s+/g, ' ')// normalize spaces
            .trim();
        let location = '';
        let cost = 'Free';
        let host = '';
        let followers = '';

        // Cost
        const costMatch = subText.match(/Starts at \$[\d.,]+/i); // String Match: "Starts at $XX.XX"
        if (costMatch){
            cost = costMatch[0];
        }
        else if (/Free/i.test(subText)) {
            cost = 'Free';
        }      

        // Followers
        const followersMatch = subText.match(/[\d,.]+ followers/i); // String Match: xx followers
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
        const locationMatch = subText.match(/[A-Za-z\s]+ • [A-Za-z\s]+, [A-Z]{2}/); // String Match: "Venue • City, ST"
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
//  *   node event.js
//  *     
//  */
// // Scrapping tutorial reference: https://medium.com/@datajournal/web-scraping-with-cheerio-0f16371a16a4

