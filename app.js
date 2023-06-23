const express = require('express');
// const {
//     verifyForgetPassword
// }= require('../invoice_test/app/controllers/authcontroller');
const app = express();
const axios = require('axios');
const { Parser } = require('htmlparser2');

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;


app.use(express.json());

const authrouter = require('./app/routes/authroutes');
const userprofilerouter = require('./app/routes/userprofile');

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.use('/api/v1',authrouter);
app.use('/api/v1',userprofilerouter);
// app.post('/verify',verifyForgetPassword)
app.get('/reset-success', (req, res) => {
    res.sendFile(__dirname + '/views/reset-success.html');
});


/*app.get('/scrape', async (req, res) => {
    const { url } = req.query;
  
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(6000000); // Set a higher timeout value
  
      const pagesData = [];
      await scrapeWebsite(url, page, pagesData);
  
      await browser.close();
  
      res.json({ pagesData });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  async function scrapeWebsite(url, page, pagesData) {
    try {
      await page.goto(url);
  
      const pageContent = await page.content();
      const visibleText = extractVisibleText(pageContent);
  
      pagesData.push({ url, content: visibleText });
  
      const links = await page.$$eval('a', (anchors) =>
        anchors.map((anchor) => anchor.href)
      );
  
      for (const link of links) {
        const newPage = await page.browser().newPage();
        await scrapeWebsite(link, newPage, pagesData);
        await newPage.close();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  function extractVisibleText(html) {
    let visibleText = '';
  
    const parser = new Parser({
      ontext(text) {
        visibleText += text.trim() + ' ';
      },
      onopentag(tagname, attributes) {
        // You can add additional checks here to filter out specific tags if needed
      },
      onclosetag(tagname) {
        // You can perform any necessary actions when a tag is closed
      },
    }, { decodeEntities: true });
  
    parser.write(html);
    parser.end();
  
    return visibleText.trim();
  }*/
  
module.exports = app;
