var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var { convert } = require('convert-svg-to-png');

router.get('/', async function(req, res, next) {
  const line = req.query.line || 0;
  const size = req.query.size || 'm'; // size : 's' | 'm' | 'l'
  const columns = req.query.col || 4;
  const username = req.query.name;

  const width = size == 's' ? 110 : size == 'l' ? 220 : 160 

  if (!username) {
    const userNameEmptyErrorMessage = 'Username is Empty';
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`<svg xmlns='http://www.w3.org/2000/svg' width='150'><text x='10' y='40'>${userNameEmptyErrorMessage}</text></svg>`);
    return null;
  }

  const html = await fetch(`https://www.credly.com/users/${username}/badges`);
  const $ = cheerio.load(await html.text());
  const badgeList = $('.cr-standard-grid-item-content__image');

  if (!badgeList.length) {
    const noDataErrorMessage = 'No Data Found';
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`<svg xmlns='http://www.w3.org/2000/svg' width='150'><text x='10' y='40'>${noDataErrorMessage}</text></svg>`);
    return null;
  }

  const imageList = [];
  badgeList.map((i, item) => {imageList[i] = item.attribs.src.trim().replace('/size/110x110', '')});
  const rows = Math.ceil(imageList.length / columns);
  const svg = line > 0 ? 
    imageList.slice((line-1)*columns, line*columns).length ?
    `<svg xmlns='http://www.w3.org/2000/svg' width='${columns*(width+20)}' height='${width+20}'>
      ${imageList.slice((line-1)*columns, line*columns).map((image, index)=>{
        return(
          `<g><image x='${index*(width+20)+10}' y='${10}' width='${width}' height='${width}' href='${image}' /></g>`
        )
      })}
    </svg>`
    : `<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'></svg>` 
  : 
  `<svg xmlns='http://www.w3.org/2000/svg' width='${columns*(width+20)}' height='${rows*(width+20)}'>
    ${Array.from({length : rows}, () => 0).map((_, row)=>{
      return imageList.slice(row*columns, (row+1)*columns).map((image, index)=>{
        return(
          `<g><image x='${index*(width+20)+10}' y='${row*(width+20)+10}' width='${width}' height='${width}' href='${image}' /></g>`
        )
      })
    })}
  </svg>`;

  res.setHeader('Content-Type', 'image/png');
  // CONTAINER_RUNTIME = 'docker' | 'none'
  if (process.env.CONTAINER_RUNTIME == 'docker') {
    res.send(await convert(svg, {puppeteer: {
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox','--disable-setuid-sandbox']
    }}));
    return null;
  } 
  res.send(await convert(svg));
});

module.exports = router;