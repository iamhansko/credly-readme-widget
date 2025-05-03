const express = require('express');
const router = express.Router();
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

  const width = size == 's' ? 80 : size == 'l' ? 220 : 160;

  if (!username) {
    const userNameEmptyErrorMessage = 'Username is Empty';
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`<svg xmlns='http://www.w3.org/2000/svg' width='160'><text x='10' y='40'>${userNameEmptyErrorMessage}</text></svg>`);
    return null;
  }

  if (!line) {
    const linenumberEmptyErrorMessage = 'Linenumber is Empty';
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`<svg xmlns='http://www.w3.org/2000/svg' width='170'><text x='10' y='40'>${linenumberEmptyErrorMessage}</text></svg>`);
    return null;
  }

  const response = await fetch(`https://www.credly.com/users/${username}/badges?page=1&page_size=100&sort=rank`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json'
    },
  });
  const jsonData = await response.json();
  const badgeList = jsonData.data;
  const imageList = badgeList.map(badge => {
    const imageData = {};
    imageData.src = badge.image_url;
    const imageString = imageData.src.split('.');
    switch(imageString[imageString.length-1]) {
      case 'png': // 600x600
        imageData.scale = size == 's' ? 0.143 : size == 'l' ? 0.391 : 0.267;
        break;
      default: // 761x761 (blob)
        imageData.scale = size == 's' ? 0.066 : size == 'l' ? 0.177 : 0.120;
        break;
    }
    return imageData;
  });

  if (!imageList.length) {
    const noDataErrorMessage = 'No Data Found';
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`<svg xmlns='http://www.w3.org/2000/svg' width='150'><text x='10' y='40'>${noDataErrorMessage}</text></svg>`);
    return null;
  }

  const svg = await imageList.slice((line-1)*columns, line*columns).reduce(async (promise, item, index) => {
    let acc = await promise;
    acc += `<g transform='scale(${item.scale})'>`
    acc += (await download(item.src)).replace('<svg', `<svg x='${(1/item.scale)*index*(width+20)+10}' y='${(1/item.scale)*10}'`)
    acc += '</g>'
    return acc.replace('<?xml version="1.0" encoding="UTF-8"?>', '')
  }, `<svg xmlns='http://www.w3.org/2000/svg' width='${columns*(width+20)}' height='${(width+20)}'>`) + '</svg>'

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(imageList?.slice((line-1)*columns, line*columns)?.length > 0 ? svg : `<svg xmlns='http://www.w3.org/2000/svg' width='0' height='0'></svg>`);
});

module.exports = router;