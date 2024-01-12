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
        supabase.from('main_article').select('article_id').then(DBresponse => {
            if(DBresponse.data.length === 0 && Articles) {
                Articles.forEach(article => {
                    supabase.from('main_article').insert({
                        article_id: article.article_id,
                        title: article.title,
                        link: article.link,
                        content: article.content,
                        image_url: article.image_url
                    });
                });
            } else if(DBresponse.data.length !== 0 && Articles) {
                let index = 0;
                for(let article of DBresponse.data) {
                    supabase.from('main_article').update({
                        title: Articles[index].title,
                        link: Articles[index].link,
                        content: Articles[index].content,
                        image_url: Articles[index].image_url
                    }).match({
                        article_id: article.article_id
                    });
                    index++;
                    if(index === Articles.length - 1) {
                        break;
                    }
                }
            }
        }).catch(error => {
            console.log(error.message);
        })
    }
    static getSavedArticles() {
        return supabase.from('main_article').select('*');
    }
}