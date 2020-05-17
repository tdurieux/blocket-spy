const chalk = require("chalk");
const jsonfile = require("jsonfile");
const parseSearchResults = require("./scripts/parse-search-results");
const reportStep = require("./utils/report-step");

const URL =
  "https://bostad.blocket.se/hitta-bostad/?lat=59.3311075&lng=59.3311075&searchString=Klarabergsviadukten%2092%2C%20111%2064%20Stockholm%2C%20Sweden&minRoomCount=1";

(async () => {
  for (let page = 1; page <= 5; page++) {
    const url = URL + "&page=" + page;
    const results = await parseSearchResults({ url: url });
    await handleResults(results);
  }
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
      jsonfile.writeFileSync("ads/" + stored.id + ".json", stored, { throws: false });
      ad = stored;
    }
    if (!ad.description) {
      const r = await parseSearchResults({
        url:
          "https://bostad.blocket.se/rent/apartment/radsvagen-huddinge/" +
          ad.id,
      });
      for (let a of r) {
        jsonfile.writeFileSync("ads/" + a.id + ".json", a, { throws: false });
        newResults.push(a);
      }
    }
  }
  return newResults;
}
const spy = (interval) => {
  console.log(
    chalk.yellow.bold(`==== Waiting to poll again in ${interval} minutes ====`)
  );
  reportStep("😴");
  setTimeout(async () => {
    console.log(chalk.yellow.bold("==== Fetching search results ===="));
    const results = await parseSearchResults({ url: URL });
    handleResults(results);
    reportStep("😴", true);
    spy(interval);
  }, interval * 60 * 1000);
};

module.exports = spy;
