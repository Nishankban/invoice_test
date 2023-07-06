const express = require('express');
const path = require('path');
const fs = require('fs');

// const {
//     verifyForgetPassword
// }= require('../invoice_test/src/controllers/authcontroller');
const app = express();
/*const axios = require('axios');
const { Parser } = require('htmlparser2');

const cheerio = require('cheerio');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;*/


app.use(express.json());

const authrouter = require('./src/routes/authroutes');
const userprofilerouter = require('./src/routes/userprofilerouter');
const locationRoutes = require('./src/routes/locationrouter');
const clientRouter = require('./src/routes/clientrouter');
const productRouter = require('./src/routes/productroutes');


app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.use('/api/v1',authrouter);
app.use('/api/v1',userprofilerouter);
app.use('/api/v1',locationRoutes);
app.use('/api/v1',clientRouter);
app.use('/api/v1/products',productRouter);
const uploadDirectory = path.join(__dirname, 'uploads/product'); // Path to the directory where images are uploaded

// Define a route to serve the uploaded image files
app.get('/uploads/product/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(uploadDirectory, fileName);

    res.sendFile(filePath, (error) => {
        if (error) {
            console.error('Error sending file:', error);
            res.status(404).send('File not found');
        }
    });
});

app.get('/api/folder-structure', (req, res) => {


    getFolderStructure(uploadDirectory)
        .then((folderStructure) => {
            res.json(folderStructure);
        })
        .catch((error) => {
            console.error('Error retrieving folder structure:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});

// Function to recursively retrieve the folder structure
function getFolderStructure(directory) {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, { withFileTypes: true }, (error, files) => {
            if (error) {
                reject(error);
            } else {
                const folderStructure = {
                    name: path.basename(directory),
                    type: 'folder',
                    children: [],
                };

                files.forEach((file) => {
                    const filePath = path.join(directory, file.name);

                    if (file.isDirectory()) {
                        folderStructure.children.push(getFolderStructure(filePath));
                    } else {
                        folderStructure.children.push({
                            name: file.name,
                            type: 'file',
                        });
                    }
                });

                resolve(folderStructure);
            }
        });
    });
}

app.get('/reset-success', (req, res) => {
    res.sendFile(__dirname + '/views/reset-success.html');
});


/*src.get('/scrape', async (req, res) => {
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
