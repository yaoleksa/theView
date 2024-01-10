import axios from 'axios';

export default class Apis {
    static getNews() {
        return axios.get('https://gnews.io/api/v4/top-headlines', {
            params: {
                country: 'ua',
                category: 'general',
                apikey: '985901b98d070eed7d957eda27580896',
                lang: 'ua'
            }
        });
    }
    static getMain() {
        return axios.get('https://newsdata.io/api/1/news', {
            params: {
                country: 'ua',
                apikey: 'pub_8576a5096c78cacae47c5c74fd5c34419a6d'
            }
        })
    }
    static getWeather() {
        return axios.get('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m');
    }
}