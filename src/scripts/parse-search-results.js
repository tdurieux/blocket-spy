const puppeteer = require("puppeteer");
const reportStep = require("../utils/report-step");

let browser = null;
module.exports = async ({ url }) => {
  if (browser == null) {
    reportStep("Getting ready to fetch search results...");
    browser = await puppeteer.launch({
      defaultViewport: {
        height: 2000,
        width: 250,
      },
    });
  }

  reportStep(`Navigating to ${url}...`);
  const page = await browser.newPage();
  await page.goto(url);

  reportStep("Scraping search results...");
  const results = await page.evaluate(() => {
    return App.context.dispatcher.stores.HomesStore.homes;
  });
  
  return results;
};
