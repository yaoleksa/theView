import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://azxmmelolclqfcfjgpka.supabase.co',
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6eG1tZWxvbGNscWZjZmpncGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwMTk0MTEsImV4cCI6MjAxNDU5NTQxMX0.nYQqwnBeFbD5qlQ6fpVxN8PH2Nvegtgga05wqEm3-y8');

export default class DB {
    token;
    refreshToken;
    constructor() {
        supabase.auth.signInWithPassword({
            email: 'ekt_1@ukr.net',
            password: 'notveryeasy4473'
        }).then(databaseResponse => {
            this.token = databaseResponse.data.session.access_token;
            this.refreshToken = databaseResponse.data.session.refresh_token;
        }).catch(err => {
            console.log(err.message);
        })
    }
    async insertArticles(Articles) {
        Articles.forEach(article => {
            supabase.from('main_article').insert({
                article_id: article.article_id,
                title: article.title,
                link: article.link,
                content: article.content,
                image_url: article.image_url
            });
        });
        supabase.from('main_article').select('article_id').then(DBresponse => {
            if(DBresponse.data.length >= 10) {
                for(let i = 0; i < 10; i++) {
                    supabase.from('main_article').delete().match(DBresponse.data[i].article_id)
                    .then(databaseResponse => {
                        console.log(databaseResponse)
                    }).catch(error => {
                        console.log(error);
                    });
                }
            }
        }).catch(error => {
            console.log(error.message);
        })
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
            if(databaseResponse.data.length > 3) {
                for(let i = 0; i < 3; i++) {
                    supabase.from('currency_info').delete().match({
                        id: databaseResponse.data[i].id
                    }).then(resp => {
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
    static getSavedArticles() {
        return supabase.from('main_article').select('*');
    }
    static getSavedRates() {
        return supabase.from('currency_info').select('*').limit(1);
    }
}