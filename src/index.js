import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Apis from './apis';
import DB from './db';

const root = ReactDOM.createRoot(document.getElementById('root'));
const week = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];
const year = [' Січеня ', ' Лютого ', ' Березня ', ' Квітня ', ' Травня ', ' Червня ', 
' Липня ', 'Серпня', 'Вересня', 'Жовтня', 'Листопада', 'Грудня'];

document.getElementsByTagName('body')[0].addEventListener('keydown', event => {
    if(event.ctrlKey && event.shiftKey && event.key === 'E') {
        root.render(<>
            <div id="auth_form">
                <label htmlFor='password'>Password: </label>
                <input type='password' placeholder='password' name='password'></input>
                <p className="submit_button" onClick={auth}>Submit</p>
            </div>
        </>);
    }
});

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
        <br></br>
        <a key={articleKey + '_'} href={link} className='sideBarLink'>{title}</a>
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
                        .replace(/^[A-Za-z\s\,]+/, ''),
                        image_url: zeroArticle.media,
                        publishedDate: zeroArticle.published_date.split(' ')[0]
                    });
                    setNew(allArticles[0]);
                    const DBclient = new DB();
                    DBclient.insertArticles(allArticles, null);
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
        <div className="main_article">
            <img className="main_image" src={mainNew.image_url}/>
            <meta itemprop="image" content={mainNew.image_url} />
            <h1 itemprop="headline">{mainNew.title}</h1>
            <p>{mainNew.content}</p>
            <span itemprop="datePublished" content={mainNew.publishedDate}>
                Дата публікації: {mainNew.publishedDate}
            </span><br/>
            <a href={mainNew.link}>Читати повний текст статті...</a>
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
        DBclient.insertArticles(articles, null);
        return news;
    } else {
        return (<div></div>);
    }
}

function GetCurrentDate() {
    const [currentTime, setCurrentTime] = useState(null);
    useEffect(() => {
        setInterval(() => {
            const [
                nameOfClass,
                date,
                currentDay,
                currentMonth,
                tommorow, 
                tommorowOne, 
                tommorowTwo, 
                tommorowThree, 
                tommorowFour,
                tommorowFive,
                currentYear,
                currentHour,
                currentMinute,
                currentSecond
            ] = dateProcessing();
            setCurrentTime({
                nameOfClass: nameOfClass,
                day: week[currentDay],
                date: date,
                month: year[currentMonth],
                year: currentYear,
                hour: currentHour,
                minute: currentMinute,
                second: currentSecond
            });
        }, 1000);
    });
    if(currentTime) {
        return <span className={currentTime.nameOfClass} id="time">
        {currentTime.day},
        &nbsp;
        {currentTime.date} 
        {currentTime.month} 
        {currentTime.year} року&nbsp;
        {currentTime.hour}:{currentTime.minute}:{currentTime.second}<br/></span>
    } else {
        return <span></span>
    }
}

function WeatherForecast() {
    const [weatherInfo, setWeather] = useState(null);
    const [IP, setIP] = useState(null);
    const [location, setLocation] = useState(null);
    useEffect(() => {
        if(!IP) {
            Apis.getIPaddress().then(response => {
                setIP(response.data.ip);
            }).catch(error => {
                console.log(error);
            });
        }
        if(IP && !location) {
            Apis.getGeoLocation(IP).then(response => {
                setLocation(response.data);
            }).catch(error => {
                console.log(error);
            });
        }
        if(location && !weatherInfo) {
            console.log('Location');
            console.log(location);
            Apis.getWeather(location).then(response => {
                setWeather(response.data);
            }).catch(error => {
                console.log(error);
            });
        }
    });
    if(weatherInfo) {
        console.log(weatherInfo);
        const [
            nameOfClass,
            date,
            currentDay,
            currentMonth,
            tommorow, 
            tommorowOne, 
            tommorowTwo, 
            tommorowThree, 
            tommorowFour, 
            tommorowFive,
            currentYear,
            currentHour,
            currentMinute,
            currentSecond
        ] = dateProcessing();
        return (<>
        <span className={nameOfClass}>
            <span className='weather'>Прогноз погоди:</span>
            <span className='weather'>{week[tommorow]}:&nbsp;&nbsp;&nbsp;&nbsp;
            {weatherInfo.hourly.temperature_2m[24 + currentHour]}{'C' + String.fromCharCode(176)}
            &nbsp;&nbsp;</span>
            <span className='weather'>{week[tommorowOne]}:&nbsp;&nbsp;&nbsp;&nbsp;
            {weatherInfo.hourly.temperature_2m[48 + currentHour]}{'C' + String.fromCharCode(176)}
            &nbsp;&nbsp;</span>
            <span className='weather'>{week[tommorowTwo]}:&nbsp;&nbsp;&nbsp;&nbsp;
            {weatherInfo.hourly.temperature_2m[64 + currentHour]}{'C' + String.fromCharCode(176)}
            &nbsp;&nbsp;</span>
            <span className='weather'>{week[tommorowThree]}:&nbsp;&nbsp;&nbsp;&nbsp;
            {weatherInfo.hourly.temperature_2m[88 + currentHour]}{'C' + String.fromCharCode(176)}
            &nbsp;&nbsp;</span>
            <span></span>
            <span className='weather'>{week[tommorowFour]}:&nbsp;&nbsp;&nbsp;&nbsp;
            {weatherInfo.hourly.temperature_2m[112 + currentHour]}{'C' + String.fromCharCode(176)}
            &nbsp;&nbsp;</span>
            <span className='weather'>{week[tommorowFive]}:&nbsp;&nbsp;&nbsp;&nbsp;
            {weatherInfo.hourly.temperature_2m[136 + currentHour]}{'C' + String.fromCharCode(176)}
            &nbsp;&nbsp;</span>
        </span>
        </>);
    } else {
        return (<span></span>);
    }
}

function ExchangeRate() {
    const [currencyRate, setRate] = useState(null);
    useEffect(() => {
        if(!currencyRate) {
            Apis.getExchangeRateCache().then(response => {
                console.log('ABOUT CURRENCY');
                console.log(response);
                const rates = response.data.rates ? response.data.rates : response.data[0].resp_body.rates;
                setRate(rates);
                DB.insertRate({
                    rates: rates
                });
            }).catch(err => {
                console.log(err.message);
            });
        }
    });
    if(currencyRate) {
        return (<>
        <br/>
        <span id="ex_rate">
            <span>{'Курси валют: '}</span>
            <span className='cu_name'>{'USD:'}&nbsp;&nbsp;&nbsp;&nbsp;
            {`${currencyRate.USD < 1 ? (1/currencyRate.USD).toFixed(2) : currencyRate.USD.toFixed(2)}  `}
            &nbsp;&nbsp;</span>
            <span className='cu_name'>{'EUR:'}&nbsp;&nbsp;&nbsp;&nbsp;
            {`${currencyRate.EUR < 1 ? (1/currencyRate.EUR).toFixed(2) : currencyRate.EUR.toFixed(2)}  `}
            &nbsp;&nbsp;</span>
            <span className='cu_name'>{'PLN:'}&nbsp;&nbsp;&nbsp;&nbsp;
            {currencyRate.PLN < 1 ? (1/currencyRate.PLN).toFixed(2) : currencyRate.PLN.toFixed(2)}
            &nbsp;&nbsp;</span>
        </span>
        </>);
    } else {
        return (<span></span>);
    }
}

function Page() {
    return (<>
        <NavigationPanel/>
        <GetCurrentDate/>
        <WeatherForecast/>
        <ExchangeRate/>
        <div className='content'>
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
            <GetCurrentDate/>
            <WeatherForecast/>
            <ExchangeRate/>
            <div className='content'>
                <MainArticle />
                <div>
                    <SideBarContainer/>
                </div>
            </div>
            </>);
    }
    root.render(<DefaultPage/>);
}

function RerenderWithWar() {
    function AboutWar() {
        const [topicNew, setNew] = useState(null);
        const [topicNews, setNews] = useState(null);
        useEffect(() => {
            Apis.getNewsByTopic('війна').then(response => {
                if(!topicNew) {
                    const allArticles = [];
                    const articleList = response.data.articles ? response.data.articles : response.data;
                    for(let article of articleList) {
                        allArticles.push({
                            article_id: Date.now(),
                            title: article.title,
                            link: article.url ? article.url : article.link,
                            content: article.description ? article.description : article.content,
                            image_url: article.image ? article.image : article.image_url,
                            publishedDate: article.publishedAt.split('T')[0]
                        });
                    }
                    setNew(allArticles.shift());
                    setNews(allArticles);
                    const client = new DB();
                    client.insertArticles(allArticles, 'війна');
                }
            }).catch(error => {
                console.log(error.message);
            });
        });
        if(topicNew && topicNews) {
            const news = [];
            for(let n of topicNews) {
                news.push(createArticle(n.article_id, n.title, n.image_url, n.link));
            }
            return (<>
                <NavigationPanel/>
                <GetCurrentDate/>
                <WeatherForecast/>
                <ExchangeRate/>
                <div className='content'>
                <div className="main_article">
                    <img className="main_image" src={topicNew.image_url}/>
                    <meta itemprop="image" content={topicNew.image_url} />
                    <h1 itemprop="headline">{topicNew.title}</h1>
                    <p>{topicNew.content}</p>
                    <span itemprop="datePublished" content={topicNew.publishedDate}>
                        Дата публікації: {topicNew.publishedDate}
                    </span><br/>
                    <a href={topicNew.link}>Читати повний текст статті...</a>
                </div>
                    <div>
                        {news}
                    </div>
                </div>
                </>);
        }
        return (<>
            <NavigationPanel/>
            <WeatherForecast/>
            <ExchangeRate/>
            <div className='content'>
                <MainArticle />
                <div>
                    <SideBarContainer/>
                </div>
            </div>
            </>);
    }
    root.render(<AboutWar/>);
}

function RenderWithHealth() {
    function AboutHealth() {
        const [topicNew, setNew] = useState(null);
        const [topicNews, setNews] = useState(null);
        useEffect(() => {
            Apis.getNewsByTopic('здоров').then(response => {
                if(!topicNew) {
                    const allArticles = [];
                    const articleList = response.data.articles ? response.data.articles : response.data;
                    for(let article of articleList) {
                        allArticles.push({
                            article_id: Date.now(),
                            title: article.title,
                            link: article.url ? article.url : article.link,
                            content: article.description ? article.description : article.content,
                            image_url: article.image ? article.image : article.image_url,
                            publishedDate: article.publishedAt.split('T')[0]
                        });
                    }
                    setNew(allArticles.shift());
                    setNews(allArticles);
                    const client = new DB();
                    client.insertArticles(allArticles, 'здоров');
                }
            }).catch(error => {
                console.log(error.message);
            });
        });
        if(topicNew && topicNews) {
            const news = [];
            for(let n of topicNews) {
                news.push(createArticle(n.article_id, n.title, n.image_url, n.link));
            }
            return (<>
                <NavigationPanel/>
                <WeatherForecast/>
                <ExchangeRate/>
                <div className='content'>
                <div className="main_article">
                    <img className="main_image" src={topicNew.image_url}/>
                    <meta itemprop="image" content={topicNew.image_url} />
                    <h1 itemprop="headline">{topicNew.title}</h1>
                    <p>{topicNew.content}</p>
                    <span itemprop="datePublished" content={topicNew.publishedDate}>
                        Дата публікації: {topicNew.publishedDate}
                    </span><br/>
                    <a href={topicNew.link}>Читати повний текст статті...</a>
                </div>
                    <div>
                        {news}
                    </div>
                </div>
                </>);
        }
        return (<>
            <NavigationPanel/>
            <WeatherForecast/>
            <ExchangeRate/>
            <div className='content'>
                <MainArticle />
                <div>
                    <SideBarContainer/>
                </div>
            </div>
            </>);
    }
    root.render(<AboutHealth/>);
}

function RenderWithSociety() {
    function AboutSociety() {
        const [topicNew, setNew] = useState(null);
        const [topicNews, setNews] = useState(null);
        useEffect(() => {
            Apis.getNewsByTopic('суспільство').then(response => {
                if(!topicNew) {
                    const allArticles = [];
                    const articleList = response.data.articles ? response.data.articles : response.data;
                    for(let article of articleList) {
                        allArticles.push({
                            article_id: Date.now(),
                            title: article.title,
                            link: article.url ? article.url : article.link,
                            content: article.description ? article.description : article.content,
                            image_url: article.image ? article.image : article.image_url,
                            publishedDate: article.publishedAt.split('T')[0]
                        });
                    }
                    setNew(allArticles.shift());
                    setNews(allArticles);
                    const client = new DB();
                    client.insertArticles(allArticles, 'суспільство');
                }
            }).catch(error => {
                console.log(error.message);
            });
        });
        if(topicNew && topicNews) {
            const news = [];
            for(let n of topicNews) {
                news.push(createArticle(n.article_id, n.title, n.image_url, n.link));
            }
            return (<>
                <NavigationPanel/>
                <WeatherForecast/>
                <ExchangeRate/>
                <div className='content'>
                <div className="main_article">
                    <img className="main_image" src={topicNew.image_url}/>
                    <meta itemprop="image" content={topicNew.image_url} />
                    <h1 itemprop="headline">{topicNew.title}</h1>
                    <p>{topicNew.content}</p>
                    <span itemprop="datePublished" content={topicNew.publishedDate}>
                        Дата публікації: {topicNew.publishedDate}
                    </span><br/>
                    <a href={topicNew.link}>Читати повний текст статті...</a>
                </div>
                    <div>
                        {news}
                    </div>
                </div>
                </>);
        }
        return (<>
            <NavigationPanel/>
            <WeatherForecast/>
            <ExchangeRate/>
            <div className='content'>
                <MainArticle />
                <div>
                    <SideBarContainer/>
                </div>
            </div>
            </>);
    }
    root.render(<AboutSociety/>);
}

function RenderWithEconomy() {
    function AboutEconomy() {
        const [topicNew, setNew] = useState(null);
        const [topicNews, setNews] = useState(null);
        useEffect(() => {
            Apis.getNewsByTopic('економіка').then(response => {
                if(!topicNew) {
                    const allArticles = [];
                    const articleList = response.data.articles ? response.data.articles : response.data;
                    for(let article of articleList) {
                        allArticles.push({
                            article_id: Date.now(),
                            title: article.title,
                            link: article.url ? article.url : article.link,
                            content: article.description ? article.description : article.content,
                            image_url: article.image ? article.image : article.image_url,
                            publishedDate: article.publishedAt.split('T')[0]
                        });
                    }
                    setNew(allArticles.shift());
                    setNews(allArticles);
                    const client = new DB();
                    client.insertArticles(allArticles, 'економіка');
                }
            }).catch(error => {
                console.log(error.message);
            });
        });
        if(topicNew && topicNews) {
            const news = [];
            for(let n of topicNews) {
                news.push(createArticle(n.article_id, n.title, n.image_url, n.link));
            }
            return (<>
                <NavigationPanel/>
                <WeatherForecast/>
                <ExchangeRate/>
                <div className='content'>
                <div className="main_article">
                    <img className="main_image" src={topicNew.image_url}/>
                    <meta itemprop="image" content={topicNew.image_url} />
                    <h1 itemprop="headline">{topicNew.title}</h1>
                    <p>{topicNew.content}</p>
                    <span itemprop="datePublished" content={topicNew.publishedDate}>
                        Дата публікації: {topicNew.publishedDate}
                    </span><br/>
                    <a href={topicNew.link}>Читати повний текст статті...</a>
                </div>
                    <div>
                        {news}
                    </div>
                </div>
                </>);
        }
        return (<>
            <NavigationPanel/>
            <WeatherForecast/>
            <ExchangeRate/>
            <div className='content'>
                <MainArticle />
                <div>
                    <SideBarContainer/>
                </div>
            </div>
            </>);
    }
    root.render(<AboutEconomy/>);
}

function RenderWithPolitic() {
    function AboutPolitic() {
        const [topicNew, setNew] = useState(null);
        const [topicNews, setNews] = useState(null);
        useEffect(() => {
            Apis.getNewsByTopic('політика').then(response => {
                if(!topicNew) {
                    const allArticles = [];
                    const articleList = response.data.articles ? response.data.articles : response.data;
                    for(let article of articleList) {
                        allArticles.push({
                            article_id: Date.now(),
                            title: article.title,
                            link: article.url ? article.url : article.link,
                            content: article.description ? article.description : article.content,
                            image_url: article.image ? article.image : article.image_url,
                            publishedDate: article.publishedAt.split('T')[0]
                        });
                    }
                    setNew(allArticles.shift());
                    setNews(allArticles);
                    const client = new DB();
                    client.insertArticles(allArticles, 'політика');
                }
            }).catch(error => {
                console.log(error.message);
            });
        });
        if(topicNew && topicNews) {
            const news = [];
            for(let n of topicNews) {
                news.push(createArticle(n.article_id, n.title, n.image_url, n.link));
            }
            return (<>
                <NavigationPanel/>
                <WeatherForecast/>
                <ExchangeRate/>
                <div className='content'>
                <div className="main_article">
                    <img className="main_image" src={topicNew.image_url}/>
                    <meta itemprop="image" content={topicNew.image_url} />
                    <h1 itemprop="headline">{topicNew.title}</h1>
                    <p>{topicNew.content}</p>
                    <span itemprop="datePublished" content={topicNew.publishedDate}>
                        Дата публікації: {topicNew.publishedDate}
                    </span><br/>
                    <a href={topicNew.link}>Читати повний текст статті...</a>
                </div>
                    <div>
                        {news}
                    </div>
                </div>
                </>);
        }
        return (<>
            <NavigationPanel/>
            <WeatherForecast/>
            <ExchangeRate/>
            <div className='content'>
                <MainArticle />
                <div>
                    <SideBarContainer/>
                </div>
            </div>
            </>);
    }
    root.render(<AboutPolitic/>);
}

function RenderWithTech() {
    function AboutTech() {
        const [topicNew, setNew] = useState(null);
        const [topicNews, setNews] = useState(null);
        useEffect(() => {
            Apis.getNewsByTopic('технології').then(response => {
                if(!topicNew) {
                    const allArticles = [];
                    const articleList = response.data.articles ? response.data.articles : response.data;
                    for(let article of articleList) {
                        allArticles.push({
                            article_id: Date.now(),
                            title: article.title,
                            link: article.url ? article.url : article.link,
                            content: article.description ? article.description : article.content,
                            image_url: article.image ? article.image : article.image_url,
                            publishedDate: article.publishedAt.split('T')[0]
                        });
                    }
                    setNew(allArticles.shift());
                    setNews(allArticles);
                    const client = new DB();
                    client.insertArticles(allArticles, 'технології');
                }
            }).catch(error => {
                console.log(error.message);
            });
        });
        if(topicNew && topicNews) {
            const news = [];
            for(let n of topicNews) {
                news.push(createArticle(n.article_id, n.title, n.image_url, n.link));
            }
            return (<>
                <NavigationPanel/>
                <WeatherForecast/>
                <ExchangeRate/>
                <div className='content'>
                <div className="main_article">
                    <img className="main_image" src={topicNew.image_url}/>
                    <meta itemprop="image" content={topicNew.image_url} />
                    <h1 itemprop="headline">{topicNew.title}</h1>
                    <p>{topicNew.content}</p>
                    <span itemprop="datePublished" content={topicNew.publishedDate}>
                        Дата публікації: {topicNew.publishedDate}
                    </span><br/>
                    <a href={topicNew.link}>Читати повний текст статті...</a>
                </div>
                    <div>
                        {news}
                    </div>
                </div>
                </>);
        }
        return (<>
            <NavigationPanel/>
            <WeatherForecast/>
            <ExchangeRate/>
            <div className='content'>
                <MainArticle />
                <div>
                    <SideBarContainer/>
                </div>
            </div>
            </>);
    }
    root.render(<AboutTech/>);
}

function auth() {
    if(document.getElementsByName('password')[0].value === '75ka$$A31') {
        root.render(
            <>
            <div id="ediror_form">
                <label htmlFor="title">Title</label><br></br>
                <input type="text" placeholder="title" name="title"></input><br></br>
                <label htmlFor="topic">Topic</label><br></br>
                <select name="topic">
                    <option>загальні</option>
                    <option>війна</option>
                    <option>здоров'я</option>
                    <option>суспільство</option>
                    <option>політика</option>
                    <option>економіка</option>
                    <option>технології</option>
                </select><br></br>
                <label htmlFor='image'>Link to image</label><br></br>
                <input type='text' name='image' placeholder='URL'></input><br></br>
                <label htmlFor='content'>Content</label><br></br>
                <textarea placeholder='Article' name='content'></textarea>
                <p className="submit_button" onClick={storeOwnArticle}>Submit</p>
            </div>
        </>);
    } else {
        setTimeout(RenderDefault, 3000);
        root.render(<><p>INVALID PASSWORD</p></>);
    }
}

function storeOwnArticle() {
    const topicMap = {
        'загальні': null,
        'війна': 'війна',
        'здоров\'я': 'здоров',
        'суспільство': 'суспільство',
        'політика': 'політика',
        'економіка': 'економіка',
        'технології': 'технології'
    }
    new DB().insertArticles([{
        article_id: Date.now(),
        title: document.getElementsByName('title')[0].value,
        link: '#',
        content: document.getElementsByName('content')[0].value,
        image_url: document.getElementsByName('image')[0].value
    }], topicMap[document.getElementsByName('topic')[0].value]);
    RenderDefault();
}

function dateProcessing() {
    const currentDate = new Date();
    const date = currentDate.getDate();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    let currentDay = currentDate.getDay() - 1;
    let nameOfClass;
    const tommorow = currentDay + 1 < 7 ? currentDay + 1 : (currentDay + 1)%7;
    const tommorowOne = currentDay + 2 < 7 ? currentDay + 2 : (currentDay + 2)%7;
    const tommorowTwo = currentDay + 3 < 7 ? currentDay + 3 : (currentDay + 3)%7;
    const tommorowThree = currentDay + 4 < 7 ? currentDay + 4 : (currentDay + 4)%7;
    const tommorowFour = currentDay + 5 < 7 ? currentDay + 5 : (currentDay + 5)%7;
    const tommorowFive = currentDay + 6 < 7 ? currentDay + 6 : (currentDay + 6)%7;
    if(currentMonth > 10 || currentMonth < 2) {
        nameOfClass = 'winter';
    } else if(currentMonth > 1 && currentMonth < 5) {
        nameOfClass = 'spring';
    } else if(currentMonth > 4 && currentMonth < 8) {
        nameOfClass = 'summer';
    } else {
        nameOfClass = 'autumn';
    }
    return [
        nameOfClass,
        date,
        currentDay,
        currentMonth,
        tommorow, 
        tommorowOne, 
        tommorowTwo, 
        tommorowThree, 
        tommorowFour,
        tommorowFive,
        currentYear,
        currentHour,
        currentMinute,
        currentSecond
    ];
}

root.render(<Page/>);