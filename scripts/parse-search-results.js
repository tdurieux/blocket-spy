const puppeteer = require('puppeteer')

module.exports = async ({ url }) => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      height: 2000,
      width: 1300
    }
  })

  const page = await browser.newPage()
  await page.goto(url)

  // close privacy notice dialog
  await page.click('button')

  const resultDivs = await page.$$('#item_list > div')
  for (const resultDiv of resultDivs) {
    // get time when listing was posted
    const timeSpan = await resultDiv.$('.jlist_date_image')
    const time = await page.evaluate(timeSpan => timeSpan.getAttribute('datetime'), timeSpan)

    // get locality of the apartment
    const addressSpan = await resultDiv.$('.subject-param.address')
    const address = await page.evaluate(addressSpan => addressSpan.innerText, addressSpan)

    // get area in sqm. if available
    // TODO

    // get monthly rent
    // TODO

    console.log(`${time} | ${address}`)
  }
  await browser.close()
}
