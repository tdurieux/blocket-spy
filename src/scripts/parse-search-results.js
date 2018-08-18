const puppeteer = require('puppeteer')
const reportStep = require('../utils/report-step')

const extractTime = async (page, resultDiv) => {
  const timeSpan = await resultDiv.$('.jlist_date_image')
  const dateString = await page.evaluate(
    timeSpan => timeSpan && timeSpan.getAttribute('datetime'),
    timeSpan
  )
  return new Date(dateString)
}

const extractLocality = async (page, resultDiv) => {
  const sizeSpan = await resultDiv.$('.details .size')
  return page.evaluate(
    sizeSpan => sizeSpan && sizeSpan.innerText.split(' ')[0],
    sizeSpan
  )
}

const extractSize = async (page, resultDiv) => {
  const sizeSpan = await resultDiv.$('.details .size')
  return page.evaluate(
    sizeSpan => sizeSpan && sizeSpan.innerText.split(' ')[0],
    sizeSpan
  )
}

const extractRooms = async (page, resultDiv) => {
  const roomsSpan = await resultDiv.$('.details .rooms')
  return page.evaluate(
    roomsSpan => roomsSpan && roomsSpan.innerText.split(' ')[0],
    roomsSpan
  )
}

const extractRent = async (page, resultDiv) => {
  const rentSpan = await resultDiv.$('.details .monthly_rent')
  const rent = await page.evaluate(
    (rentSpan) => {
      const parts = rentSpan ? rentSpan.innerText.split(' ') : []
      const filteredParts = parts.filter((value) => !isNaN(value))
      return parseInt(filteredParts.join(''), 10)
    }, rentSpan)
}

module.exports = async ({ url }) => {
  reportStep('Getting ready to fetch search results...')
  const browser = await puppeteer.launch({
    defaultViewport: {
      height: 2000,
      width: 1300
    }
  })

  reportStep(`Navigating to ${url}...`)
  const page = await browser.newPage()
  await page.goto(url)

  reportStep(`Closing privacy notice dialog...`)
  await page.click('button')

  reportStep('Scraping search results...')
  const results = []
  const resultDivs = await page.$$('#item_list > div')
  for (const resultDiv of resultDivs) {
    results.push({
      time: await extractTime(page, resultDiv),
      locality: await extractLocality(page, resultDiv),
      size: await extractSize(page, resultDiv),
      rooms: await extractRooms(page, resultDiv),
      rent: await extractRent(page, resultDiv)
    })
  }

  reportStep(`Got ${results.length} results`, true)
  await browser.close()
  return results
}
