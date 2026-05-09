export default class DB {
    constructor() { }
    async insertArticles(Articles, q) {
        if(!Array.isArray(Articles)) {
            Articles = [ Articles ];
        }
        Articles.forEach(article => {
            fetch(`https://yellow-dream-c8c6.mryaremchyk.workers.dev?entity=article&q=${q}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(article)
            }).then(response => {
                response.json().then(data => {
                    console.log(`db.js.insertArticle.response.json(): ${data}`);
                }).catch(error => {
                    if(error) {
                        console.error(`db.js.insertArticle.response.json(): ${error.message}`);
                    }
                })
            });
        });
    }
    static insertRate(obj) {
        fetch('https://yellow-dream-c8c6.mryaremchyk.workers.dev?entity=rate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj.rates)
        }).catch(error => {
            if(error) {
                console.error(`db.js.insertRate.catch.error: ${error}`);
            }
        })
    }
    static getSavedArticles(q) {
        return fetch(`https://yellow-dream-c8c6.mryaremchyk.workers.dev/?entity=article&topic=${q}`);
    }
    static getSavedRates() {
        return fetch('https://yellow-dream-c8c6.mryaremchyk.workers.dev/?entity=rate');
    }
}