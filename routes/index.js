const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const { vectorize, ColorMode, Hierarchical, PathSimplifyMode } = require('@neplex/vectorizer');
const { writeFile, readFile, access, mkdir } = require('node:fs/promises');

const download = async (url) => {
  await mkdir('caches', { recursive: true })
  const pngFilename = `caches/${url.split('/images/')[1].replace('/', '-')}`;
  const svgFilename = pngFilename.replace('png', 'svg');

  try {
    await access(svgFilename)
    const vector = await readFile(svgFilename, 'utf-8')
    return vector
  } catch(error) {
    const img = await fetch(url)
    const buffer = await img.arrayBuffer();
    await writeFile(pngFilename, Buffer.from(buffer));
    const src = await readFile(pngFilename);
    const vector = await vectorize(src, {
      colorMode: ColorMode.Color,
      colorPrecision: 7,
      filterSpeckle: 4,
      spliceThreshold: 15,
      cornerThreshold: 15,
      hierarchical: Hierarchical.Stacked,
      mode: PathSimplifyMode.Spline,
      layerDifference: 6,
      lengthThreshold: 5,
      maxIterations: 2,
      pathPrecision: 7
    })
    await writeFile(svgFilename, vector)
    return vector
  }
}

router.get('/', async function(req, res, next) {
  const line = req.query.line;
  const size = req.query.size || 'm'; // size : 's' | 'm' | 'l'
  const columns = req.query.col && req.query.col > 0 ? req.query.col : 4;
  const username = req.query.name;

  const width = size == 's' ? 110 : size == 'l' ? 220 : 160;
  const scale = size == 's' ? 0.183 : size == 'l' ? 0.367 : 0.267;

  if (!username) {
    const userNameEmptyErrorMessage = 'Username is Empty';
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`<svg xmlns='http://www.w3.org/2000/svg' width='150'><text x='10' y='40'>${userNameEmptyErrorMessage}</text></svg>`);
    return null;
  }

  if (!line) {
    const linenumberEmptyErrorMessage = 'Linenumber is Empty';
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`<svg xmlns='http://www.w3.org/2000/svg' width='150'><text x='10' y='40'>${linenumberEmptyErrorMessage}</text></svg>`);
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

  const svg = await imageList.slice((line-1)*columns, line*columns).reduce(async (promise, item, index) => {
    let acc = await promise;
    acc += `<g transform='scale(${scale})'>`
    acc += (await download(item)).replace('<svg', `<svg x='${(1/scale)*index*(width+20)+10}' y='${(1/scale)*10}'`)
    acc += '</g>'
    return acc.replace('<?xml version="1.0" encoding="UTF-8"?>', '')
  }, `<svg xmlns='http://www.w3.org/2000/svg' width='${columns*(width+20)}' height='${(width+20)}'>`) + '</svg>'

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(imageList?.slice((line-1)*columns, line*columns)?.length > 0 ? svg : `<svg xmlns='http://www.w3.org/2000/svg' width='0' height='0'></svg>`);
});

module.exports = router;