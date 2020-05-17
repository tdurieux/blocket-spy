const puppeteer = require("puppeteer");
const reportStep = require("../utils/report-step");

let browser = null;
module.exports = async ({ url }) => {
  if (browser == null) {
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
  
  const results = await page.evaluate(() => {
    return App.context.dispatcher.stores.HomesStore.homes;
  });
  await page.close();
  return results;
};
