export default class Apis {
    static getIPaddress() {
        return new Promise((resolve, reject) => {
            resolve("45.45.45.45");
            reject("Failed to get ip address");
        });
    }
    static getGeoLocation(ip) {
        return new Promise((resolve, reject) => {
            resolve({
                "ip": ip,
                "city": "City",
                "region": "Region",
                "country": "CN",
                "loc": "00.0000,00.0000",
                "org": "Provider",
                "postal": "00000",
                "timezone": "Continent/City",
                "readme": "https://ipinfo.io/missingauth"
              });
            reject("Failed to retrieve a geolocation data");
        });
    }
    static getMainNew() {
        axios.get('https://free-news.p.rapidapi.com/v1/search?q=*&lang=uk', {
            headers: {
                'X-RapidAPI-Key': 'dc40d2b288msh88ced99c0191b37p144f83jsne853bb67a11f'
            }
        });
        return new Promise((resolve, reject) => {
            resolve({
                "articles": [
                    {
                        "_id": 1,
                        "title": "title",
                        "link": "https://somelink",
                        "summary": "text",
                        "media": "https://image",
                        "published_date": new Date()
                    }
                ]
            });
            reject("Failed to get main new");
        });
    }
    static getNews() {
        new Promise((resolve, reject) => {
            resolve({});
            reject("Failed to get news");
        });
    }
    static getWeather(location) {
        return new Promise((resolve, reject) => {
            resolve({});
            reject("Failed to get weather");
        })
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