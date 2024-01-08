import axios from 'axios';

const getNews = () => {
    return axios.get('https://free-news.p.rapidapi.com/v1/search?q=*&lang=uk', {
        headers: {
            'X-RapidAPI-Key': 'dc40d2b288msh88ced99c0191b37p144f83jsne853bb67a11f'
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