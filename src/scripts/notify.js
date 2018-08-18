const notifier = require('node-notifier')
const open = require('open')

module.exports = ({ results, url }) => {
  notifier.on('click', () => {
    open(url)
  })

  if (results.length > 1) {
    notifier.notify({
      title: `Found ${results.length} new ${results.length === 1 ? 'listing' : 'listings'} on Blocket.se`,
      message: 'Click here to see them.',
      sound: true,
      wait: true
    })
  } else {
    const result = results[0]
    notifier.notify({
      title: `${result.locality}, ${result.size}m², ${result.rooms} rooms`,
      message: `Rent ${result.rent}kr. Click here to see it.`,
      sound: true,
      wait: true
    })
  }
}
