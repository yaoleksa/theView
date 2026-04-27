// All logic related to API usage
import DB from './db';

export default class Apis {
    static getIPaddress() {
        return fetch('https://api.ipify.org/?format=json');
    }
    static getGeoLocation(ip) {
        return fetch(`https://ipinfo.io/${ip}/geo`);
    }
    static getNews() {
        return fetch(`https://newsdata.io/api/1/news?apikey=${process.env.APIKEY}&country=ua&language=uk&q=все`);
    }
    static getWeather(location) {
        const latLong = location.loc.split(',');
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latLong[0]}&longitude=${latLong[1]}&hourly=temperature_2m`);
    }
    static getExchangeRateCache() {
        return fetch('https://exchange-rate-api1.p.rapidapi.com/latest?base=UAH', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.X_RAPID_API_KEY,
                'X-RapidAPI-Host': process.env.X_RAPID_API_HOST
            }
        }).catch(error => {
            if(error) {
                console.error(error.message);
                return DB.getSavedArticles();
            }
        });
    }
    static getNewsByTopic(topic) {
        console.log(`apis.js.getNewsByTopic.topic: ${topic}`);
        return fetch(`https://newsdata.io/api/1/news?apikey=${process.env.APIKEY}&country=ua&language=uk&q=${topic}`);
    }
}