import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Apis from './apis';
import DB from './db';

const root = ReactDOM.createRoot(document.getElementById('root'));
const week = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];
const year = [' Січеня ', ' Лютого ', ' Березня ', ' Квітня ', ' Травня ', ' Червня ',
' Липня ', 'Серпня', 'Вересня', 'Жовтня', 'Листопада', 'Грудня'];

const navigationMapper = {
    'війна': 'war',
    'здоров': 'health',
    'суспільство': 'society',
    'економіка': 'economy',
    'політика': 'politic',
    'технології': 'tech'
}

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

function NavigationPanel({selected}) {
    const mainSelected = selected === "main" ? "selected_bar" : "";
    const warSelected = selected === "war" ? "selected_bar": "";
    const healthSelected = selected === "health" ? "selected_bar" : "";
    const societySelected = selected === "society" ? "selected_bar" : "";
    const politicSelected = selected === "politic" ? "selected_bar" : "";
    const economySelected = selected === "economy" ? "selected_bar" : "";
    const techSelected = selected === "tech" ? "selected_bar" : "";
    return (<>
        <span id="navigation">
            <a href='#' className="topic" name={mainSelected} id="main"
            onClick={RenderDefault}>Головна</a>
            <a href='#' className="topic" name={warSelected}
            onClick={() => RenderWithTopic('війна')}>Новини з фронту</a>
            <a href='#' className="topic" name={healthSelected}
             onClick={() => RenderWithTopic('здоров')}>Здоров'я</a>
            <a href='#' className="topic" name={societySelected}
             onClick={() => RenderWithTopic('суспільство')}>Суспільство</a>
            <a href='#' className="topic" name={politicSelected}
             onClick={() => RenderWithTopic('політика')}>Політика</a>
            <a href='#' className="topic" name={economySelected}
             onClick={() => RenderWithTopic('економіка')}>Економіка</a>
            <a href='#' className="topic" name={techSelected}
             onClick={() => RenderWithTopic('технології')}>Технології</a>
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
            Apis.getNews('все').then(response => {
                setNew(response.shift());
            }).catch(error => errorHandler('index.js.MainArticle.Apis.getNews()', error));
        }
    });
    if(mainNew) {
        return (<>
        <div className="main_article">
            <img className="main_image" src={mainNew.image_url}/>
            <meta itemProp="image" content={mainNew.image_url} />
            <h1 itemProp="headline">{mainNew.title}</h1>
            <p>{mainNew.description}</p>
            <span itemProp="datePublished" content={mainNew.pubDate}>
                Дата публікації: {mainNew.pubDate}
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
            Apis.getNews('все').then(response => {
                setArticles(response.length > 1 ? response.slice(1): response);
            }).catch(err => errorHandler('index.js.SideBarContainer.Apis.getNews()', err));
        }
    });
    if(articles.length > 0) {
        const DBclient = new DB();
        for(let article of articles) {
            const novetly = { ...createArticle(article.article_id, article.title, article.image_url, article.link) };
            novetly.key = article.article_id ? article.article_id : Date.now();
            console.log(novetly);
            news.push(novetly);
        }
        DBclient.insertArticles(articles, 'все');
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
                day: week[currentDay >= 0 ? currentDay : 6],
                date: date,
                month: year[currentMonth],
                year: currentYear,
                hour: currentHour > 9 ? currentHour : `0${currentHour}`,
                minute: currentMinute > 9 ? currentMinute : `0${currentMinute}`,
                second: currentSecond > 9 ? currentSecond : `0${currentSecond}`
            });
        }, 1000);
    });
    if(currentTime) {
        return <span className={currentTime.nameOfClass} id="time">
        {currentTime.day},
        &nbsp;
        {currentTime.date} &nbsp;
        {currentTime.month} &nbsp;
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
                response.json().then(data => {
                    if(data.ip) {
                        setIP(data.ip);
                    } else {
                        setIP('127.0.0.1');
                    }
                }).catch(error => errorHandler('index.js.WeatherForecast.getIPaddress.response.json()', error));
            }).catch(error => errorHandler('index.js.WeatherForecast.getIPaddress', error));
        }
        if(IP && !location) {
            Apis.getGeoLocation(IP).then(response => {
                response.json().then(data => {
                    setLocation(data);
                }).catch(error => errorHandler('index.js.WeatherForecast.getGeolocation.response.json()', error));
            }).catch(error => errorHandler('index.js.WeatherForecast.getGeolocation', error));
        }
        if(location && !weatherInfo) {
            Apis.getWeather(location).then(response => {
                response.json().then(data => {
                    setWeather(data);
                }).catch(error => errorHandler('index.js.Apis.getWeather.response.json()', error));
            }).catch(error => errorHandler('index.js.Apis.getWeather', error));
        }
    });
    if(weatherInfo) {
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
        <span className={nameOfClass} id='weather_start'>
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
                if(response.status != 429) {
                    response.json().then(data => {
                        const rates = data.rates ? data.rates : data[0].resp_body.rates;
                        setRate(rates);
                        DB.insertRate({
                            rates: rates
                        });
                    }).catch(error => errorHandler('index.js.ExchangeRate.Apis.getExchangeRateCache.response.json()', error));
                } else {
                    DB.getSavedRates().then(response => {
                        response.json().then(data => {
                            setRate(data.shift());
                        })
                    })
                }
            }).catch(err => errorHandler('index.js.ExchangeRate.Apis.getExchangeRateCache', err));
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
        <NavigationPanel selected={"main"}/>
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
            <NavigationPanel selected={"main"}/>
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

function RenderWithTopic(topic) {
    function AboutTopic() {
        const [topicNew, setNew] = useState(null);
        const [topicNews, setNews] = useState(null);
        useEffect(() => {
            if(!topicNew) {
                Apis.getNews(topic).then(response => {
                    console.log('ln335');
                    setNew(response.shift());
                    setNews(response);
                });
            }
        });
        if(topicNew && topicNews) {
            const news = [];
            for(let n of topicNews) {
                const novetly = { ...createArticle(n.article_id, n.title, n.image_url, n.link) };
                novetly.key = n.article_id;
                news.push(novetly);
            }
            return (<>
                <NavigationPanel selected={navigationMapper[topic]}/>
                <GetCurrentDate/>
                <WeatherForecast/>
                <ExchangeRate/>
                <div className='content'>
                <div className="main_article">
                    <img className="main_image" src={topicNew.image_url}/>
                    <meta itemProp="image" content={topicNew.image_url} />
                    <h1 itemProp="headline">{topicNew.title}</h1>
                    <p>{topicNew.description}</p>
                    <span itemProp="datePublished" content={topicNew.publishedDate}>
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
            <NavigationPanel selected={navigationMapper[topic]}/>
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
    root.render(<AboutTopic />);
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

function errorHandler(ctx, err) {
    if(err) {
        console.error(`${ctx}: ${err.message}`);
    }
}

root.render(<Page/>);