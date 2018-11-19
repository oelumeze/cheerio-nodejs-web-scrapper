const express = require('express');
const app = express();
const axios = require('axios');
var request = require('request');
const cheerio = require('cheerio');
const port = process.env.PORT || 3500;
const webdriver = require('selenium-webdriver');
const By = webdriver.By
const Key = webdriver.Key
const d = new webdriver.Builder().forBrowser('chrome').build();


app.use(express())

app.get('/scrape', async(req, res, next) => {
    let driver = await new webdriver.Builder().forBrowser('chrome').build();
    try {
        await driver.get('https://primenow.amazon.com/search?k=meats&p_95=A0AR&merchantId=A1WLPFK2G4U7Y5&ref_=pn_sr_nav_sr_A0AR');
        await driver.findElement(By.id('lsPostalCode')).sendKeys('02143');
        // await driver.findElement(By.id('label-password')).sendKeys('vicente@1988');
        await driver.findElement(By.className('a-button-input')).click();
        
    } catch (ex) {
        console.error("ex", ex)
    }
    finally {
    //   await driver.quit();
    }
})


app.listen(port)
console.log("Node application running on port " + port);  
