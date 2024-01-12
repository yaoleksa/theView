import axios from 'axios';
import DB from './db';

export default class Apis {
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
}