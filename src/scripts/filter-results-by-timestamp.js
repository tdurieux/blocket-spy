const reportStep = require('../utils/report-step')

module.exports = (listings, since) => {
  reportStep('Filtering out outdated results')
  const filteredResults = listings.filter((listing) => new Date(listing.createdAt) > since)

  reportStep(`Filtered down to ${filteredResults.length} new results (since last run at ${since})`, true)
  return filteredResults
}
