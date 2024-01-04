import axios from 'axios';

const getNews = async () => {
    return await axios.get('https://free-news.p.rapidapi.com/v1/search?q=*&lang=uk', {
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

export {
    getNews
};