import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Apis from './apis';
import DB from './db';

function NavigationPanel() {
    return (<>
        <span id="navigation">
            <a href='#' className="topic" id="main" onClick={RenderDefault}>Головна</a>
            <a href='#' className="topic" onClick={RerenderWithWar}>Новини з фронту</a>
            <a href='#' className="topic" onClick={RenderWithHealth}>Здоров'я</a>
            <a href='#' className="topic" onClick={RenderWithSociety}>Суспільство</a>
            <a href='#' className="topic" onClick={RenderWithPolitic}>Політика</a>
            <a href='#' className="topic" onClick={RenderWithEconomy}>Економіка</a>
            <a href='#' className="topic" onClick={RenderWithTech}>Технології</a>
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
            Apis.getMainNew().then(response => {
                console.log(`Response status: ${response.status}`);
                const allArticles = [];
                if(response.data.articles) {
                    const zeroArticle = response.data.articles.shift();
                    allArticles.push({
                        article_id: zeroArticle._id,
                        title: zeroArticle.title,
                        link: zeroArticle.link,
                        content: zeroArticle.summary
                        .replace(/Автор фото, /g, '')
                        .replace(/Підпис до фото/g, '')
                        .replace(/Getty Images/g, ''),
                        image_url: zeroArticle.media
                    });
                    setNew(allArticles[0]);
                    DBclient.insertArticles(allArticles);
                } else {
                    setNew(response.data.shift());
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
    const news = [];
    useEffect(() => {
        if(articles.length === 0) {
            Apis.getNews().then(response => {
                if(response.data.results) {
                    const allArticles = response.data.results.filter(article => article.language === 'ukrainian' && article.image_url && article.image_url.length > 10);
                    allArticles.shift();
                    setArticles(allArticles);
                } else {
                    setArticles(response.data);
                }
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

function WeatherForecast() {
    const [weatherInfo, setWeather] = useState(null);
    useEffect(() => {
        if(!weatherInfo) {
            Apis.getWeather().then(response => {
                setWeather(response.data);
            }).catch(error => {
                console.log(error.message);
            });
        }
    });
    if(weatherInfo) {
        console.log(weatherInfo);
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentMonth = currentDate.getMonth();
        let nameOfClass;
        if(currentMonth > 10 || currentMonth < 2) {
            nameOfClass = 'winter';
        } else if(currentMonth > 1 && currentMonth < 5) {
            nameOfClass = 'spring';
        } else if(currentMonth > 4 && currentMonth < 8) {
            nameOfClass = 'summer';
        } else {
            nameOfClass = 'autumn';
        }
        return (<>
        <span className={nameOfClass}>
            <span className='weather'>Прогноз погоди:</span>
            <span className='weather'>{`${weatherInfo.hourly.time[24 + currentHour].split('T')[0]}:`}</span>
            <span>{weatherInfo.hourly.temperature_2m[24 + currentHour]}{'C' + String.fromCharCode(176)}</span>
            <span className='weather'>{`${weatherInfo.hourly.time[48 + currentHour].split('T')[0]}:`}</span>
            <span>{weatherInfo.hourly.temperature_2m[48 + currentHour]}{'C' + String.fromCharCode(176)}</span>
            <span className='weather'>{`${weatherInfo.hourly.time[64 + currentHour].split('T')[0]}:`}</span>
            <span>{weatherInfo.hourly.temperature_2m[64 + currentHour]}{'C' + String.fromCharCode(176)}</span>
            <span className='weather'>{`${weatherInfo.hourly.time[88 + currentHour].split('T')[0]}:`}</span>
            <span>{weatherInfo.hourly.temperature_2m[88 + currentHour]}{'C' + String.fromCharCode(176)}</span>
            <span className='weather'>{`${weatherInfo.hourly.time[112 + currentHour].split('T')[0]}:`}</span>
            <span>{weatherInfo.hourly.temperature_2m[112 + currentHour]}{'C' + String.fromCharCode(176)}</span>
            <span className='weather'>{`${weatherInfo.hourly.time[136 + currentHour].split('T')[0]}:`}</span>
            <span>{weatherInfo.hourly.temperature_2m[136 + currentHour]}{'C' + String.fromCharCode(176)}</span>
        </span>
        </>);
    } else {
        return (<span></span>);
    }
}

function Page() {
    return (<>
        <NavigationPanel/>
        <WeatherForecast/>
        <div id='content'>
            <MainArticle />
            <div>
                <SideBarContainer/>
            </div>
        </div>
        </>);
}

function RenderDefault() {
    function DefaultPage() {
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
    ReactDOM.createRoot(document.getElementById('root')).render(<DefaultPage/>);
}

function RerenderWithWar() {
    function AboutWar() {
        return (<>
            <NavigationPanel/>
            <div id='content'>
                <p>There will be article about war</p>
                <div>
                    <SideBarContainer/>
                </div>
            </div>
            </>);
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<AboutWar/>);
}

function RenderWithHealth() {
    function AboutHealth() {
        return (<>
            <NavigationPanel/>
            <div id='content'>
                <p>There will be article about health</p>
                <div>
                    <SideBarContainer/>
                </div>
            </div>
            </>);
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<AboutHealth/>);
}

function RenderWithSociety() {
    function AboutSociety() {
        return (<>
            <NavigationPanel/>
            <div id='content'>
                <p>There will be article about society</p>
                <div>
                    <SideBarContainer/>
                </div>
            </div>
            </>);
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<AboutSociety/>);
}

function RenderWithPolitic() {
    function AboutPolitic() {
        return (<>
            <NavigationPanel/>
            <div id='content'>
                <p>There will be article about politic</p>
                <div>
                    <SideBarContainer/>
                </div>
            </div>
            </>);
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<AboutPolitic/>);
}

function RenderWithEconomy() {
    function AboutEconomy() {
        return (<>
            <NavigationPanel/>
            <div id='content'>
                <p>There will be article about economy</p>
                <div>
                    <SideBarContainer/>
                </div>
            </div>
            </>);
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<AboutEconomy/>);
}

function RenderWithTech() {
    function AboutTech() {
        return (<>
            <NavigationPanel/>
            <div id='content'>
                <p>There will be article about tech</p>
                <div>
                    <SideBarContainer/>
                </div>
            </div>
            </>);
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<AboutTech/>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<Page/>);
export { NavigationPanel, SideBarContainer };