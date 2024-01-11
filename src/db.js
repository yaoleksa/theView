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
    insertArticle(Article) {
        supabase.from('main_article').select('article_id').then(DBresponse => {
            if(DBresponse.data.length === 0 && Article) {
                supabase.from('main_article').insert({
                    article_id: Article.article_id,
                    title: Article.title,
                    link: Article.link,
                    content: Article.content
                }).then(resp => {
                    console.log(resp);
                }).catch(err => {
                    console.log(err.message);
                })
            } else if(DBresponse.data.length !== 0 && Article) {
                console.log(`id: ${DBresponse.data[0].id}`);
                supabase.from('main_article').update({
                    title: Article.title,
                    link: Article.link,
                    content: Article.content
                }).match({
                    article_id: DBresponse.data[0].article_id
                }).then(result => {
                    console.log(result);
                })
            }
        }).catch(error => {
            console.log(error.message);
        })
    }
    getSavedArticle
}