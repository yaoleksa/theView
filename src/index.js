import React from 'react';
import ReactDOM from 'react-dom/client';
import { getNews } from './apis';

class NavigationPanel extends React.Component {
    render() {
        getNews();
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
    render() {
        // implement logic here
        return (<p id="side_bar">Side bar container</p>);
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