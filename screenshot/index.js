const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // deviceScaleFactor controls image quality, see https://github.com/GoogleChrome/puppeteer/issues/571#issuecomment-325404760
  await page.setViewport({width: 800, height: 600, deviceScaleFactor: 2});

  await page.goto('https://mood.guidogarcia.net/team.html?team=main');

  // XXX try to use a better heuristic to wait for the xhr requests to finish
  //     e.g. await page.waitForNavigation({'waitUntil' : 'networkidle2'});
  await page.waitFor(5000);

  await page.screenshot({path: 'mood.png', fullPage: true});

  await browser.close();
})();