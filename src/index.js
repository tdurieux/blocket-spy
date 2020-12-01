const chalk = require("chalk");
const fs = require("fs");
const jsonfile = require("jsonfile");
const parse = require("./scripts/parse-search-results");
const reportStep = require("./utils/report-step");
const notify = require("./scripts/notify");
const translate = require("@vitalets/google-translate-api");

const URL =
  "https://bostad.blocket.se/p2/en/find-home/?searchAreas[]=Stockholm%3BStockholms%20kommun%3B25929985";

(async () => {
  const results = await parse.getLatest();
  await handleResults(results);
})();

async function handleResults(results) {
  const newResults = [];
  for (let i in results) {
    let ad = results[i];
    const stored = jsonfile.readFileSync("ads/" + ad.id + ".json", {
      throws: false,
    });
    if (stored != null) {
      stored.applicationCount = ad.applicationCount;
      stored.inContactCount = ad.inContactCount;
      stored.declinedCount = ad.declinedCount;
      stored.matchingCount = ad.matchingCount;
      jsonfile.writeFileSync("ads/" + stored.id + ".json", stored, {
        throws: false,
      });
      ad = stored;
    }
    if (ad.description === undefined || ad.user === undefined) {
      const r = await parse.extractDetails({
        url:
          "https://bostad.blocket.se/rent/apartment/radsvagen-huddinge/" +
          ad.id,
      });
      for (let a of r) {
        if (!fs.existsSync("ads/" + a.id + ".json") || a.user !== undefined) {
          if (a.rent <= 12000 && a.shared == false) {
            try {
              const result = await translate(a.description, {
                to: "en",
                from: "sv",
              });
              a.description_en = result.text;
            } catch (error) {
              console.log(error);
            }
            notify({
              results: [a],
              url: "https://bostad.blocket.se/listings/" + a.id + "/",
            });
          }

          jsonfile.writeFileSync("ads/" + a.id + ".json", a, { throws: false });
          newResults.push(a);
        }
      }
    }
  }
  for (let r of newResults) {
  }
  return newResults;
}
const spy = (interval) => {
  console.log(
    chalk.yellow.bold(`==== Waiting to poll again in ${interval} minutes ====`)
  );
  reportStep("😴");
  setTimeout(async () => {
    const results = await parse.getLatest();
    await handleResults(results);
    reportStep(`Fetching done`, true);
    spy(interval);
  }, interval * 60 * 1000);
};

module.exports = spy;
