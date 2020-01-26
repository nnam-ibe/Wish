import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<BrowserRouter><Route path="/" component={App} /></BrowserRouter>, div);
	// Timeout to allow firebase to unsubscribe
	setTimeout(() => ReactDOM.unmountComponentAtNode(div), 100);
});
