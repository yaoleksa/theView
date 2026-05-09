// All logic related to API usage
import DB from './db';

export default class Apis {
    static getIPaddress() {
        return fetch('https://api.ipify.org/?format=json');
    }
    static getGeoLocation(ip) {
        return fetch(`https://ipinfo.io/${ip}/geo`);
    }
    static async getNews(topic) {
        const data = [];
        const request = await fetch(`https://newsdata.io/api/1/news?apikey=${process.env.APIKEY}&country=ua&language=uk&q=${topic}`);
        if(request.status != 200) {
            const dbRequest = await fetch(`https://yellow-dream-c8c6.mryaremchyk.workers.dev/?entity=article&topic=${topic}`);
            data.push(...await dbRequest.json());
        } else {
            data.push(...await request.json());
        }
        if(data.length === 0) {
            data.push([
                { article_id: Date.now(), image_url: 'NO_URL', title: 'NO_TITLE', description: 'NO_DESCRIPTION', pubDate: 'NO_DATE' },
                { article_id: Date.now(), image_url: 'NO_URL', title: 'NO_TITLE', description: 'NO_DESCRIPTION', pubDate: 'NO_DATE' }
            ]);
        }
        return data;
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
            }
        });
    }
}