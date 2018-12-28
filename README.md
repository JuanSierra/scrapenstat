# Scrap 'n' Stats (WiH HN)
This project allows to do web scraping for job related posts published in HackerNews.  It gets the content from the url's configured and procces it to make a bars graphic based on it.

# Installation
```sh
git clone https://github.com/JuanSierra/scrapenstat.git
cd scrapenstat
npm install
```

# Usage

## Start the local server
The basic usage of the project is to start a server locally with the current processed data for all the 12 months in 2018.  It deploys the docs folder content by default at http://localhost:8080

```sh
npm start
```

## Change configuration
You can define new months or discard some of the existing ones.  The configuration also allows to add or remove new keywords or extend the search with more aliases.

The configuration file ([data/config.yml](https://github.com/JuanSierra/scrapenstat/blob/master/data/config.yml)) has two big sections.  The first section is used for holding the HN WhoIsHiring links that will be web scrapped and the second one defines the tech-related keywords and its classification.
The current structure is described below and it is detailed in the config section:

* months
  * name
  * url

* keywords
  * category
  * words
      * name
      * aliases

## Process the configuration
If you changed the configuration in any way and you want to run the process again you just need to run the following:

```sh
npm run build
```

the result is a new `stats.json` file in the data folder, then you can publish (it means minify and copy) that file and all the other static files with:

```sh
npm run publish
```

# Config
Each configuration part is described below:

  * **months**: section which describes the months and links whose data is going to be extracted.
  * **months/name**: the month name; this must has a coincidence with the d3 abbreviated month name e.g., jan, feb, etc.
  * **months/url**: HackerNews url used for a specific WhoisHiring month. 
  * **keywords**: section which defines the keywords to be extracted from the posts.
  * **keywords/words**: list of keywords that will be searched by the process.
  * **keywords/words/name**: main keyword, usually represents a technology e.g., python, C#, kubernetes, etc.
  * **keywords/words/aliases**: similar words that would be related to its main keyword. It's up to you if you relate for example django as aliases with **python** as the keyword.

# Credits
D3 work credits to [@zakariachowdhury](https://github.com/zakariachowdhury)

# Disclaimer
* **Hits** refers to the number of posts a keyword is mentioned for a particular month.  This value could give you any notion of importance but is not the intent to reflects any kind of statistical meaning.
* I defined all the keywords manually based on the data I get from only a single month (october 2018).  Any additions are available from modifying the configuration ([config.yml](https://github.com/JuanSierra/scrapenstat/blob/master/data/config.yml)).
* Categorization was done also arbitrary and you are invited to re arrange groups in a more interesting way.
* I Used a mixed strategy to get the most reliable data from the job posts content, we are talking about natural language so the process is open to have a minimum error.

# License
The project is Open Source software released under the [Apache 2.0 license](https://github.com/JuanSierra/scrapenstat/blob/master/LICENSE).