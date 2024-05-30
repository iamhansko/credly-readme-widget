var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var { convert } = require('convert-svg-to-png');

router.get('/', async function(req, res, next) {
  const columns = req.query.col || 4;
  const username = req.query.name;

  if (!username) {
    const userNameEmptyErrorMessage = "Username is Empty";
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="150"><text x="10" y="40">${userNameEmptyErrorMessage}</text></svg>`);
    return null;
  }

  const data = [];
  const html = await fetch(`https://www.credly.com/users/${username}/badges`);
  const $ = cheerio.load(await html.text());
  const badgeList = $('.cr-public-earned-badge-grid-item');

  if (!badgeList.length) {
    const noDataErrorMessage = "No Data Found";
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="150"><text x="10" y="40">${noDataErrorMessage}</text></svg>`);
    return null;
  }

  badgeList.map((i, item) => {
    data[i] = {
      image : $(item).find('img.cr-standard-grid-item-content__image').attr('src')?.trim().replace('/size/110x110', ''),
      link : 'https://www.credly.com' + $(item).attr('href'),
      title : $(item).find('div.cr-standard-grid-item-content__title').text().trim()
    }
  });
  const rows = Math.ceil(data.length / columns);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width='${columns*240}' height='${rows*240}'>
      ${Array.from({length : rows}, () => 0).map((_, row)=>{
        return data.slice(row*columns, (row+1)*columns).map((item, index)=>{
          return(
            `<g>
              <image x='${index*240+10}' y='${row*240+10}' width='220' height='220' href='${item.image}' />
            </g>`
          )
        })
      })}
    </svg>
  `;

  res.setHeader('Content-Type', 'image/png');
  res.send(await convert(svg, {puppeteer: {
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox','--disable-setuid-sandbox']
  }}));
});

module.exports = router;