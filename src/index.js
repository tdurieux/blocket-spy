const chalk = require('chalk')
const filterSearchResults = require('./scripts/filter-results-by-timestamp')
const jsonfile = require('jsonfile')
const notify = require('./scripts/notify')
const parseSearchResults = require('./scripts/parse-search-results')
const reportStep = require('./utils/report-step')

const LAST_RUN_DATA_FILE = '/tmp/.blocket-spy-last-run'

const spy = async ({ url, interval }) => {
  console.log(chalk.yellow.bold('\n==== Fetching search results ===='))
  const results = await parseSearchResults({ url: url })

  console.log(chalk.yellow.bold('\n==== Filtering out results ===='))
  const lastRunData = jsonfile.readFileSync(LAST_RUN_DATA_FILE, { throws: false })
  const lastCheckedListingTimestamp = lastRunData
    ? lastRunData.timestamp
    : new Date('2018-01-01 00:00:00')
  const filteredResults = filterSearchResults(results, lastCheckedListingTimestamp)
  jsonfile.writeFileSync(LAST_RUN_DATA_FILE, { timestamp: new Date() },  { throws: false })

  console.log(chalk.yellow.bold('\n==== Wrapping up ===='))
  reportStep('Desktop notification...')
  if (filteredResults.length > 0) {
    reportStep('Desktop notification... sent', true)
    notify({ results: filteredResults, url })
  } else {
    reportStep('Desktop notification... not sent (nothing new found)', true)
  }

  console.log(chalk.yellow.bold(`\n==== Waiting to poll again in ${interval} minutes ====`))
  reportStep('😴')
  setTimeout(() => {
    reportStep('😴', true)
    spy({ url, interval })
  }, interval * 60 * 1000)
}

module.exports = spy
