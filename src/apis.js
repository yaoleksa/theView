import axios from 'axios';

const getNews = () => {
    return axios.get('https://free-news.p.rapidapi.com/v1/search?q=*&lang=uk', {
        headers: {
            'X-RapidAPI-Key': 'dc40d2b288msh88ced99c0191b37p144f83jsne853bb67a11f'
        }
    }).then(response => {
        console.log(response.data.articles);
        return response.data.articles;
    }).catch(err => {
        console.error(err.message);
    });
}

const getWeather = () => {
    return axios.get('http://api.weatherapi.com/v1/forecast.json?key=73ecd75942e440f28cd91909231310&q=Lviv')
    .then(weatherData => {
        console.log(weatherData.data);
        return weatherData.data;
    }).catch((err) => {
        return err.message;
    })
};

export {
    getNews,
    getWeather
};