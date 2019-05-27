import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './redux/store';

import App from './components';
import 'jquery/dist/jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'react-notifications/lib/notifications.css';
import 'bootstrap/dist/css/bootstrap.css';
import './lib/mathlivedist/mathlive.core.css';
import './lib/mathlivedist/mathlive.css';
import './lib/font-awesome/css/font-awesome.min.css';
import './styles/styles.scss';

import '../images/favicon.png';

render((
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>
), document.getElementById('root'));
