import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { getNews, getWeather } from './apis';

function NavigationPanel() {
    return (<>
                <span id="navigation">
                    <a href="./index.html" className="topic" id="main">Головна</a>
                    <a href="./pages/war_in_Ukraine.html" className="topic">Новини з фронту</a>
                    <a href="./pages/health.html" className="topic">Здоров'я</a>
                    <a href="./pages/society.html" className="topic">Суспільство</a>
                    <a href="./pages/politic.html" className="topic">Політика</a>
                    <a href="./pages/economy.html" className="topic">Економіка</a>
                    <a href="./pages/tech.html" className="topic">Технології</a>
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

function MainArticle() {
    const [mainNew, setNew] = useState(null);
    useEffect(() => {
        if(!mainNew) {
            getNews().then(response => {}).catch(error => {});
        }
    });
    console.log(mainNew);
    return (<></>);
}

function SideBarContainer() {
    const [articles, setArticles] = useState([]);
    const [weatherInfo, setInfo] = useState(null);
    const news = [];
    useEffect(() => {
        if(articles.length === 0) {
            getNews().then(response => {
                console.log(response.data.results);
                response.data.results.shift();
                setArticles(response.data.results);
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
            if(article.image_url) {
                news.push(createArticle(article.article_id, article.title, article.image_url, article.link));
            }
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