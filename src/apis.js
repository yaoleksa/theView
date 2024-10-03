import axios from 'axios';
import DB from './db';

export default class Apis {
    static getIPaddress() {
        return axios.get('https://api.ipify.org/?format=json');
    }
    static getGeoLocation(ip) {
        return axios.get(`https://ipinfo.io/${ip}/geo`);
    }
    static getNews() {
        return axios.get('https://newsdata.io/api/1/news', {
            params: {
                country: 'ua',
                apikey: 'pub_8576a5096c78cacae47c5c74fd5c34419a6d'
            }
        }).catch(err => {
            console.log(`and this one: ${err.message}`);
            return DB.getSavedArticles(null);
        })
    }
    static getWeather(location) {
        const latLong = location.loc.split(',');
        return axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latLong[0]}&longitude=${latLong[1]}&hourly=temperature_2m`);
    }
    static getExchangeRateCache() {
        return axios.request({
            method: 'GET',
            url: 'https://exchange-rate-api1.p.rapidapi.com/latest',
            params: {
                base: 'UAH'
            },
            headers: {
                'X-RapidAPI-Key': 'dc40d2b288msh88ced99c0191b37p144f83jsne853bb67a11f',
                'X-RapidAPI-Host': 'exchange-rate-api1.p.rapidapi.com'
              }
        }).catch(error => {
            console.log(error.message);
            return DB.getSavedRates();
        });
    }
    static getNewsByTopic(topic) {
        return axios.request({
            method: 'GET',
            url: 'https://gnews.io/api/v4/search',
            params: {
                q: topic,
                lang: 'ua',
                country:'ua',
                max: 10,
                apikey: '985901b98d070eed7d957eda27580896'
            }
        }).catch(error => {
            console.log(error.message);
            return DB.getSavedArticles(topic);
        })
    }
}