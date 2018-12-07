const yaml = require('js-yaml');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
const keyArrays = ['go', 'js', 'golang', 'react'];
const filter = new KeywordFilter();
var regex = require('word-regex')();
var categories = [];
var months = [];

for (const keyword of config.keywords){
    categories[keyword.category] = 0;
};

// Init counter and filter
var keyCount = [];
for (const item of keyArrays){
    keyCount[item] = 0;
};
filter.init(keyArrays);

// Customized KeywordFilter for matching words
function KeywordFilter(){
    this.keysArray = [];
    this.init = function(keysArray){
        this.keysArray = keysArray;
    }

    this.getOccurances = function(text){
        var words = text.match(regex);
        var result = [];

        for (const key of  this.keysArray){
            if(result.indexOf(key)==-1 
                && words.indexOf(key)>0){
                result.push(key);
            }
        };

        return result;
    }
}

for (const month of config.months) {
    console.log(month.url)
    request(month.url, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        
        const $ = cheerio.load(body);
        var imgs = $(".athing .ind img[width=\"0\"]");

        imgs.each(function(i, item){
            countKeywordInBody( $(this).closest("tr").text());
        });
        processMonth(month.name);
        console.log(months);
    });
}

function countKeywordInBody(content){
    var occurances = filter.getOccurances(content);

    for (var w of occurances) {
        if(keyCount.hasOwnProperty(w))
            keyCount[w]++;
    };
}

function processMonth(month){
    months.push({
        name: month,
        data: keyCount
    });
    // refactor
    keyCount = [];
    for (const item of keyArrays){
        keyCount[item] = 0;
    };
}