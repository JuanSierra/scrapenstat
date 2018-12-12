const yaml = require('js-yaml');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
let keyArrays = []; //= ['go', 'js', 'golang', 'react'];
const filter = new KeywordFilter();
var regex = require('word-regex')();
var categories = [];
var months = [];

for (var keyword of config.keywords){
    var allKeyWords = keyword.words;
    var res = allKeyWords.map((w)=>{
        let d = [w.name];
        if(w.hasOwnProperty("aliases"))
          d = d.concat(w.aliases.split(','));
        
        return d;
      });

    var flatted = res.flat().map(x => x.trim());
    categories[keyword.category] = flatted;
    keyArrays = keyArrays.concat(flatted);
}

// Remove duplicates
keyArrays = keyArrays.filter(function(item, pos) {
    return keyArrays.indexOf(item) == pos;
});

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

        fs.writeFile("./stats_out.js", JSON.stringify(buildOutput()), function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("Saved!");
        });
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

function buildOutput(){
    var stats = [];
    
    for (const item of keyArrays){
        var word = {name: item, values: [], categories: [] };
        for (const month of months){
            word.values.push({date: month.name, price: month.data[item]})
        }
        
        var wordCategories = [];
        
        for (let index in categories){
            console.log(categories[index])
            console.log(item)
            console.log(categories[index].indexOf(item))
            if(categories[index].indexOf(item)>-1)
                wordCategories.push(index);
        };
        word.categories = wordCategories;
        stats.push(word);
    };

    return { stats: stats };
}