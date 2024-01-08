import axios from 'axios';

const getNews = () => {
    return axios.get('https://newsdata.io/api/1/news?country=ua&apikey=pub_8576a5096c78cacae47c5c74fd5c34419a6d');
}

const getWeather = () => {
    return axios.get('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m');
};

export {
    getNews,
    getWeather
};