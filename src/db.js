export default class DB {
    constructor() { }
    async insertArticles(Articles, q) {
        if(!Array.isArray(Articles)) {
            return;
        }
        Articles.forEach(article => {
            fetch(`https://script.google.com/macros/s/${process.env.ACTIVATION_ID}/exec?entity=article`, {
                method: 'POST',
                body: article
            }).then(response => {
                console.log(`db.insertArticles.ln12: ${response.data}`);
            });
        });
    }
    static insertRate(obj) {
        supabase.from('currency_info').insert({
            id: Date.now(),
            resp_body: obj
        }).then(response => {
            console.log(response);
        }).catch(errora => {
            console.log(errora.message);
        });
        supabase.from('currency_info').select('id').then(databaseResponse => {
            if(databaseResponse.data.length >= 6) {
                for(let i = 0; i < 3; i++) {
                    supabase.from('currency_info').delete().match({
                        id: databaseResponse.data[i].id
                    }).then(resp => {
                        console.log('item has been deleted');
                        console.log(resp);
                    }).catch(err => {
                        console.log(err.message);
                    });
                }
            }
        }).catch(error => {
            console.log(error.message);
        })
    }
    static getSavedArticles(q) {
        if(!q) {
            return supabase.from('main_article').select('*').is('topic', null);
        }
        return supabase.from('main_article').select('*').match({
            topic: q
        });
    }
    static getSavedRates() {
        return supabase.from('currency_info').select('*').limit(1);
    }
}