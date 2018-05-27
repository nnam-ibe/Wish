import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app/App.jsx';
import { BrowserRouter, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
	<BrowserRouter><Route path='/' component={App}/></BrowserRouter>,
	document.getElementById('root')
);
registerServiceWorker();
