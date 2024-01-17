import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Apis from './apis';
import DB from './db';

function NavigationPanel() {
    if(document.location.href.includes('https://yaoleksa.github.io/theView/')) {
        return (<>
            <span id="navigation">
                <a href="https://yaoleksa.github.io/theView/index.html" className="topic" id="main">Головна</a>
                <a href="https://yaoleksa.github.io/theView/war_in_Ukraine.html" className="topic">Новини з фронту</a>
                <a href="https://yaoleksa.github.io/theView/health.html" className="topic">Здоров'я</a>
                <a href="https://yaoleksa.github.io/theView/society.html" className="topic">Суспільство</a>
                <a href="https://yaoleksa.github.io/theView/politic.html" className="topic">Політика</a>
                <a href="https://yaoleksa.github.io/theView/economy.html" className="topic">Економіка</a>
                <a href="https://yaoleksa.github.io/theView/tech.html" className="topic">Технології</a>
            </span>
        </>);
    }
    return (<>
        <span id="navigation">
            <a href="./index.html" className="topic" id="main">Головна</a>
            <a href="./war_in_Ukraine.html" className="topic">Новини з фронту</a>
            <a href="./health.html" className="topic">Здоров'я</a>
            <a href="./society.html" className="topic">Суспільство</a>
            <a href="./politic.html" className="topic">Політика</a>
            <a href="./economy.html" className="topic">Економіка</a>
            <a href="./tech.html" className="topic">Технології</a>
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
            Apis.getNews().then(response => {
                console.log(`Response status: ${response.status}`);
                if(response.data.results) {
                    const allArticles = response.data.results.filter(article => article.language === 'ukrainian' && article.image_url);
                    setNew(allArticles.shift());
                    DBclient.insertArticles(allArticles);
                } else {
                    setNew(response.data.shift());
                    DBclient.insertArticles(response.data);
                }
            }).catch(error => {
                console.error(error.message);
            });
        }
    });
    console.log(mainNew);
    if(mainNew) {
        return (<>
        <div id="main_article">
            <img id="main_image" src={mainNew.image_url}/>
            <h1>{mainNew.title}</h1>
            <p>{mainNew.content}</p>
        </div>
        </>);
    } else {
        return (<div></div>);
    }
}

function SideBarContainer() {
    const [articles, setArticles] = useState([]);
    const [weatherInfo, setInfo] = useState(null);
    const news = [];
    useEffect(() => {
        if(articles.length === 0) {
            Apis.getNews().then(response => {
                if(response.data.results) {
                    const allArticles = response.data.results.filter(article => article.language === 'ukrainian' && article.image_url);
                    allArticles.shift();
                    setArticles(allArticles);
                } else {
                    setArticles(response.data);
                }
            }).catch(err => {
                console.error(err.message);
            });
        }
        if(!weatherInfo) {
            Apis.getWeather().then(response => {
                console.log(response.data.current);
                setInfo(response.data.current);
            }).catch(err => {
                console.error(err.message);
            });
        }
    });
    if(articles.length > 0) {
        const DBclient = new DB();
        for(let article of articles) {
            news.push(createArticle(article.article_id, article.title, article.image_url, article.link));
        }
        DBclient.insertArticles(articles);
        return news;
    } else {
        return (<div></div>);
    }
}

function Page() {
    return (<>
        <NavigationPanel/>
        <div id='content'>
            <MainArticle />
            <div>
                <SideBarContainer/>
            </div>
        </div>
        </>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<Page/>);
export { NavigationPanel, SideBarContainer };