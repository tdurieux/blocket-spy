#!/usr/bin/env node
const yargs = require('yargs')
const blocketSpy = require('./')

const args = yargs.command('start', 'Start spying on Blocket\'s search result page')
  .option('url', {
    alias: 'u',
    description: 'The Blocket.se search page URL that will be monitored for new additions'
  })
  .option('interval', {
    alias: 'i',
    default: 5,
    description: 'Time in minutes to wait before consecutive polls'
  })
  .demand(['url'])
  .check((argv, options) => {
    if (argv.i < 2) {
      throw new Error('Polling interval can\'t be less than 2 minutes')
    }
    return true
  })
  .argv

// let's go
blocketSpy({
  url: args.url,
  interval: args.interval
})
