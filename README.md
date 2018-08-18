# blocket-spy
blocket-spy can monitor the Swedish online marketplace `Blocket.se` as a continuously running process and post desktop notifications when new assets satisfying your search criteria are posted.

## ⚠️ Disclaimer ⚠️
This is an exploratory proof-of-concept website-scraping project. Scraping Blocket.se or other websites might be against the terms and conditions that you agree to as a user. It is your responsibility to check this! The availability of this tool does not guarantee your right to use it.

## ⚠️ Oh, and also... ⚠️
Unsophisticated website-scraping implementations like this project are susceptible to break when the pages being scraped (in this case, Blocket.se) undergo changes. Feel free to report issues or open pull requests, but be aware that things might appear to stop working momentarily or for longer.

## Getting started
### Prerequisites
1. Install Node.js from https://nodejs.org/en/download/
2. Install NPM (Node Package Manager) from https://www.npmjs.com/get-npm

### Installing
`npm install -g blocket-spy`

### Usage
Run `blocket-spy` to see all available options. As a bare minimum, the search page URL (after you've applied all your filters) should be provided like this: `blocket-spy -u https://www.blocket.se/bostad/uthyres/stockholm?sort=&ss=&se=&ros=&roe=&bs=3&be=&mre=&q=&q=&q=&is=1&save_search=1&l=0&md=th&f=p&f=c&f=b`

1. Open https://www.blocket.se, and click on 'Bostad' and then on 'Uthyres'
2. Select your filters (such as number of rooms, price range)
3. Copy the address from your browser's address bar and use it as the `-u` option to `blocket-spy`

### Limitations
Currently supports spying only on apartments for rent (Bostad / Uthyres), and not other asset types such as second hand goods.

## Contributing
Pull requests are welcome for fixing issues or adding more features. Things that could be useful are unit tests and more safety nets for when something goes wrong.
