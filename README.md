# Scrap 'n' Stats (WiH HN)
This project allows to do web scraping for job related posts published in HN.  Get the content from the url's configured and make a statistics graphic based on it.

# Installation
```sh
git clone https://github.com/JuanSierra/scrapenstat.git

npm install
```

# Usage

## Start the local server
The basic usage is to start a server locally with the current processed data for all the 12 months in 2018.

```sh
npm start
```

## Change configuration
You can define new months or discard some of the existent.  The configuration also allows to add or remove new keywords or extend the search with more aliases.

The configuration file (data/config.yml) has two big sections.  The first for the HN WhoIsHiring links that will be web scrapped and the second for the categorization and the keywords.
The current structure is as described below and is detailed in the config section:

* months
  * name
  * url

* keywords
  * category
  * words
      * name
      * aliases

## Process the configuration
If you changed the configuration and want to run the process again.

```sh
npm run build
```

I'm using github docs folder to publish the static files.  I tried to use the simplest pipeline to compress files.

```sh
npm run publish
```

# Config
Each section:

  * **months**: section which describes the months and links whose data is going to be extracted.
  * **name**: month name, this must has a coincidence with the d3 abbreviated month name e.g., jan, feb, etc.
  * **url**: HackerNews url used for an specific WhoisHiring month. 
  * **keywords**: section which defines the keywords to be extracted from the posts.
  * **words**: list of keywords that will be searched by .
  * **name**: main keyword, usually represents a technology e.g., python, C#, kubernetes, etc.
  * **aliases**: similar words that would be related to its main keyword. I up to you if you relate for example django as aliases with **python** as the keyword.

# Credits
D3 work credits to [@zakariachowdhury](https://github.com/zakariachowdhury)

# Disclaimer
* Extracted all the key words manually based on only one month.  Any additions are available from modifying configuration ([config.yml](https://github.com/JuanSierra/scrapenstat/blob/master/data/config.yml)).
* Categorization was done also arbitrary and you are invited to re arrange more interesting groups.
* Used a mixed strategy to get the most reliable data from the job posts, thinking in natural language, the process is open to have a minimum error.

# License
The project is Open Source software released under the [Apache 2.0 license](https://github.com/JuanSierra/scrapenstat/blob/master/LICENSE).