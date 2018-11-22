const yaml = require('js-yaml');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
const keyArrays = ['go', 'js', 'lang', '我哈', '你呀'];

for (const month of config.months) {
    console.log(month.url)
    request(month.url, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    
    const $ = cheerio.load(body);
    $(".athing .ind img[width=\"0\"]").parentsUntil(".athing").each(function(i, item){
        console.log($(this).html())
    }); 
    });
}

function countKeywordInBody(body){
    console.log(filter.getOccurances(content))
}