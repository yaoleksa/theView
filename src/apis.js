import axios from 'axios';

const getNews = () => {
    return axios.get('https://free-news.p.rapidapi.com/v1/search?q=*&lang=uk', {
        headers: {
            'X-RapidAPI-Key': 'dc40d2b288msh88ced99c0191b37p144f83jsne853bb67a11f'
        }
    });
}

const getWeather = () => {
    return axios.get('http://api.weatherapi.com/v1/forecast.json?key=73ecd75942e440f28cd91909231310&q=Lviv');
};

export {
    getNews,
    getWeather
};