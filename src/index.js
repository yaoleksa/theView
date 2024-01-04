import React from 'react';
import ReactDOM from 'react-dom/client';

class NavigationPanel extends React.Component {
    render() {
        return (<>
        <span id="navigation">
            <a href="#" class="topic">Головна</a>
            <a href="#" class="topic">Новини з фронту</a>
            <a href="#" class="topic">Здоров'я</a>
            <a href="#" class="topic">Суспільство</a>
            <a href="#" class="topic">Політика</a>
            <a href="#" class="topic">Економіка</a>
            <a href="#" class="topic">Технології</a>
        </span>
        </>);
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(<NavigationPanel/>);