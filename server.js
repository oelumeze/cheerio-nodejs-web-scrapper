const express = require('express');
const app = express();
var request = require('request');
const cheerio = require('cheerio');
const port = process.env.PORT || 3500;
const fileByNumber = Math.random(1000*4)

const createCSVWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCSVWriter({
    path: './csvwiter_'+fileByNumber+'.csv',
    header: [
        { id: "id", title: "ID" },
        { id: "name", title: "NAME" },
        { id: "price", title: "PRICE" }
    ]
})

const WHOLE_FOODS_URL = 'https://primenow.amazon.com/search?k=meats&p_95=A0AR&merchantId=A1WLPFK2G4U7Y5&ref_=pn_sr_nav_sr_A0AR';
// const WHOLE_FOODS_URL = 'https://primenow.amazon.com/cart/initiatePostalCodeUpdate?newPostalCode=02143&noCartUpdateRequiredUrl=%2Fsearch%3Fref_%3Dpn_sf_nav_sr_A0AR%26k%3Dmilk%26merchantId%3DA1WLPFK2G4U7Y5%26p_95%3DA0AR&allCartItemsSwappableUrl=%2Fsearch%3Fref_%3Dpn_sf_nav_sr_A0AR%26k%3Dmilk%26merchantId%3DA1WLPFK2G4U7Y5%26p_95%3DA0AR&someCartItemsUnswappableUrl=%2Fsearch%3Fref_%3Dpn_sf_nav_sr_A0AR%26k%3Dmilk%26merchantId%3DA1WLPFK2G4U7Y5%26p_95%3DA0AR&offer-swapping-token=S888WvTay7j2B8zIKUfUR12Yn91u8j3D'
const siteCookie = 'ubid-main=133-3779578-1761223; csm-hit=NXGXB0D510BJD4EXJFST+b-K4CGZY9RWDWVG2N82CWQ|1542593149418; session-id=143-7713370-8154209; session-id-time=2082787201l; session-token=Z7yBI4TkB5y9pkqfOQH25rJ/G6RqYMLYoe3JMHJM3i5Dbc309Gbr+SoH6QTDIuo5LOEwdq0D8MdEN/7wYTK6R/TaXfY9uXs3pJsKv9G6ZBI2nrE+XwbWPY689t31JM00QFOhbzDpZmGTOo7M84r5ZhNbhQ7bHrLFjWSk0w7fRFwI0U8dMjSyaeHfIW5/PkQCHhQFOlk23FtM9AIhENwCkw==';
app.use(express())
app.get('/scrapeMe', (req, res, next) => {
    let productList = []
    request({
        method: "GET",
        url: WHOLE_FOODS_URL,
        headers: {
            'Cookie' : siteCookie
        }
    }, (err, response, html) => {
        
        const $ = cheerio.load(html);
        let id = 0
        let priceArray = []
        $('.text_truncate__root__3qLEs', '.asin_card__title__1_oXO').each(function () {
            let name = $(this).text()
            productList.push({ id: id, name: name, price: "" })
            id++;
        });

        $('.asin_price__root__152p2', '.asin_offer_price__priceContainer__vxeKl').each(function () {
            let price = $(this).text()     
            priceArray.push(price)
        })
        productList.map((_index, _value) => {
            console.log("index", _index)
            _index.price = priceArray[_value]
        })

        csvWriter.writeRecords(productList)       
            .then((_x) => {

                console.log('...Done', fileByNumber);
                res.download('./csvwiter_'+fileByNumber+'.csv');
            }).catch((_error) => {
                console.log("error", _error)
            });
    })

})

app.listen(port)
console.log("Node application running on port " + port);  