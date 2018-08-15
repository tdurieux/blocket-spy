const program = require('commander')
const parseSearchResults = require('./scripts/parse-search-results')

program
  .version('1.0.0')
  .option('-u, --url <url>', 'The Blocket.se search page URL to monitor for new items')
  .option('-i, --interval', 'The polling interval (in minutes)')
  .parse(process.argv)

if (program.url) { console.log('  - url') }
if (program.interval) { console.log('  - interval') }

// validations
if (!program.url) {
  throw new Error('Option --url is required')
}

(async () => {
  await parseSearchResults({ url: program.url })
})()
