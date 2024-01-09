import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://azxmmelolclqfcfjgpka.supabase.co',
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6eG1tZWxvbGNscWZjZmpncGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwMTk0MTEsImV4cCI6MjAxNDU5NTQxMX0.nYQqwnBeFbD5qlQ6fpVxN8PH2Nvegtgga05wqEm3-y8');

const signIn = () => {
    return supabase.auth.signInWithPassword({
        email: 'ekt_1@ukr.net',
        password: 'notveryeasy4473'
    });
}

const insertArticle = () => {
    supabase.from('name of my table').insert({
        // all field
    });
}

export { signIn, insertArticle }