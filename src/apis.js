import axios from 'axios';
import DB from './db';

export default class Apis {
    static getMainNew() {
        return axios.get('https://free-news.p.rapidapi.com/v1/search?q=*&lang=uk', {
            headers: {
                'X-RapidAPI-Key': 'dc40d2b288msh88ced99c0191b37p144f83jsne853bb67a11f'
            }
        });
    }
    static getNews() {
        return axios.get('https://newsdata.io/api/1/news', {
            params: {
                country: 'ua',
                apikey: 'pub_8576a5096c78cacae47c5c74fd5c34419a6d'
            }
        }).catch(err => {
            console.log(`and this one: ${err.message}`);
            return DB.getSavedArticles();
        })
    }
    static getWeather() {
        return axios.get('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m');
    }
    static getExchangeRateCache() {
        return axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
    }
    static getExchangeRateNoCache() {
        return axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11');
    }
    // static defineLanguage(txt) {
    //     return axios.request({
    //         method: 'POST',
    //         url: 'https://api.edenai.run/v2/translation/language_detection',
    //         headers: {
    //             authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNGFjNDRmMmYtMGEyNS00ZGRlLWFmMWMtNmM1OTk3ZWJkN2U0IiwidHlwZSI6ImFwaV90b2tlbiJ9.c4w7Zyxd9EactKPLaOGVmKwoZ8Z_JPn8UHTlwOMBRrE'
    //         },
    //         data: {
    //             providers: 'google',
    //             text: txt
    //         }
    //     });
    // }
}