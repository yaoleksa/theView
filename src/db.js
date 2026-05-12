export default class DB {
    constructor() { }
    async insertArticles(Articles, q) {
        if(!Array.isArray(Articles)) {
            Articles = [ Articles ];
        }
        fetch('https://yellow-dream-c8c6.mryaremchyk.workers.dev?entity=article', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "articles": Articles,
                "topic": q
            }),
        }).then(response => {
            if(response.status == 200) {
                response.json().then(msg => {
                    console.log(msg);
                }).catch(err => {
                    console.error(err.message);
                })
            }
        }).catch(err => console.error(err.message));
    }
    static insertRate(obj) {
        fetch('https://yellow-dream-c8c6.mryaremchyk.workers.dev?entity=rate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj),
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