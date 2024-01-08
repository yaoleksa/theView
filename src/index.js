import React, { useEffect, useState } from 'react';
import { use } from 'react';
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

function createArticle(articleKey, title, imageSource) {
    return (<>
    <div key={articleKey} className='sideBarArticles'>
        <img src={`${imageSource}`} key={'_' + articleKey} className='sideBarImg'/>
        <p key={articleKey + '_'}>{title}</p>
    </div>
    </>);
}

function SideBarContainer() {
    const [articles, setArticles] = useState([]);
    const [weatherInfo, setInfo] = useState([]);
    const news = [];
    useEffect(() => {
        if(articles.length === 0) {
            getNews().then(response => {
                console.log(response.data.articles);
                setArticles(response.data.articles);
            })
        }
    });
    if(articles.length > 0) {
        for(let article of articles) {
            news.push(createArticle(article.id, article.title, article.media));
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