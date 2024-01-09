import axios from 'axios';

const getNews = () => {
    return axios.get('https://gnews.io/api/v4/top-headlines', {
        params: {
            country: 'ua',
            category: 'general',
            apikey: '985901b98d070eed7d957eda27580896'
        }
    });
}

const getWeather = () => {
    return axios.get('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m');
};

export {
    getNews,
    getWeather
};