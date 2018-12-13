const yaml = require('js-yaml');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
var regex = require('word-regex')();
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));

let keyArrays = []; 
const filter = new KeywordFilter();
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
// not the aliases
var main_words = config.keywords.map(key=>key.words.map(w=>w.name)).flat()

// Remove duplicates
keyArrays = keyArrays.filter(function(item, pos) {
    return keyArrays.indexOf(item) == pos;
});

// Init counter and filter
var keyCount = [];
for (const item of keyArrays){
    keyCount[item] = 0;
}
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
            if(result.indexOf(key) == -1 
                && words.indexOf(key) > 0){
                result.push(key);
            }
        }

        return result;
    }
}

for (const month of config.months) {
    console.log(month.url)
    request(month.url, function (error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        
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
    }
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
    }
}

function buildOutput(){
    var stats = [];

    for (const item of keyArrays){
        if(main_words.indexOf(item) > -1){
            var word = {name: item, values: [], categories: [] };
            var configWord = config.keywords.map(key=>key.words).flat().find(w=>w.name == item);
            var aliases = configWord.hasOwnProperty("aliases") ? configWord.aliases.split(',').map(x=>x.trim()) : [];

            for (const month of months){
                var aliasCont = 0;

                for (const alias of aliases){
                    aliasCont+= month.data[alias];
                }
                word.values.push({date: month.name, price: aliasCont + month.data[item]});
            }
            
            var wordCategories = [];
            
            for (let index in categories){
                if(categories[index].indexOf(item) > -1)
                    wordCategories.push(index);
            }
            word.categories = wordCategories;
            stats.push(word);
        }
    }

    return { stats: stats };
}