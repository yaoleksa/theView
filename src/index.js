import React from 'react';
import ReactDOM from 'react-dom/client';
import { getNews, getWeather } from './apis';

class NavigationPanel extends React.Component {
    render() {
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
}

class SideBarContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articlesList: []
        }
    }
    componentDidUpdate(prevProps, prevState) {}
    render() {
        const arr = [];
        getNews().then(list => {
            for(let article of list) {
                let p = document.createElement('p');
                p.innerText = article.summary;
                arr.push(p);
            }
        }).catch((error) => {
            if(error) {
                console.error(error.message);
            }
        });
        getWeather();
        return (arr);
    }
}

class Page extends React.Component {
    render() {
        return (<>
        <NavigationPanel/>
        <SideBarContainer/>
        </>);
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(<Page/>);