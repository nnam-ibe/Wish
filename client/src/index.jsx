import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './components/app/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
	<BrowserRouter><Route path="/" component={App} /></BrowserRouter>,
	document.getElementById('root'),
);
registerServiceWorker();
