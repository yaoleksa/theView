import React from 'react';
import ReactDOM from 'react-dom/client';
import { NavigationPanel, SideBarContainer } from '../../src/index';

function App() {
    return (<>
    <NavigationPanel/>
    <SideBarContainer/>
    </>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

