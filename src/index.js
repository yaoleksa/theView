import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { getNews, getWeather } from './apis';

function NavigationPanel() {
    return (<>
                <span id="navigation">
                    <a href="#" className="topic">Головна</a>
                    <a href="#" className="topic">Новини з фронту</a>
                    <a href="#" className="topic">Здоров'я</a>
                    <a href="#" className="topic">Суспільство</a>
                    <a href="#" className="topic">Політика</a>
                    <a href="#" className="topic">Економіка</a>
                    <a href="#" className="topic">Технології</a>
                </span>
        </>);
}

function createArticle(articleKey, title, imageSource, link) {
    return (<>
    <div key={articleKey} className='sideBarArticles'>
        <img src={`${imageSource}`} key={'_' + articleKey} className='sideBarImg'/>
        <a key={articleKey + '_'} href={link}>{title}</a>
    </div>
    </>);
}

function SideBarContainer() {
    const [articles, setArticles] = useState([]);
    const [weatherInfo, setInfo] = useState(null);
    const news = [];
    useEffect(() => {
        if(articles.length === 0) {
            getNews().then(response => {
                console.log(response.data.articles);
                setArticles(response.data.articles);
            }).catch(err => {
                console.error(err.message);
            });
        }
        if(!weatherInfo) {
            getWeather().then(response => {
                console.log(response.data.current);
                setInfo(response.data.current);
            }).catch(err => {
                console.error(err.message);
            });
        }
    });
    if(articles.length > 0) {
        for(let article of articles) {
            news.push(createArticle(article._id, article.title, article.media, article.link));
        }
        return news;
    } else {
        return (<div></div>);
    }
}

function Page() {
    return (<>
        <NavigationPanel/>
        <SideBarContainer/>
        </>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<Page/>);