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

  reportStep(`Navigating to ${url} ...`);
  const page = await browser.newPage();
  try {
    await page.goto(url);

    const results = await page.evaluate(() => {
      const homes = App.context.dispatcher.stores.HomesStore.homes;
      if (App.context.dispatcher.stores.UsersStore) {
        const users = App.context.dispatcher.stores.UsersStore.users;
        for (let home of homes) {
          for (let user of users) {
            if (user.uid == home.userUid) {
              home.user = user;
            }
          }
        }
      }
      return homes;
    });
    await page.close();
    return results;
  } catch (error) {
    await page.close();
    return [];
  }
};
