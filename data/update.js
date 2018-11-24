const yaml = require('js-yaml');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
const keyArrays = ['go', 'js', 'lang', 'react'];
const KeywordFilter = require('keyword-filter');
const filter = new KeywordFilter();
var keyCount = [];
for (const item of keyArrays){
    keyCount[item] = 0;
};
console.log(keyCount);
console.log("va")
filter.init(keyArrays);

for (const month of config.months) {
    console.log(month.url)
    request(month.url, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        
        const $ = cheerio.load(body);
        var imgs = $(".athing .ind img[width=\"0\"]");
        console.log(imgs.length)
        imgs.each(function(i, item){
            countKeywordInBody( $(this).closest("tr").text());
            console.log(keyCount);
        });
    });
}



function countKeywordInBody(content){
    var occurances = filter.getOccurances(content);

    var words = occurances.map(function (item) {
        return item.value;
    });
    console.log(words)
    var filtered = words.filter(function(item, index){
        return words.indexOf(item) >= index; 
    });

    for (var w of filtered) {
        if(keyCount.hasOwnProperty(w)) 
            keyCount[w]++;
    };
}