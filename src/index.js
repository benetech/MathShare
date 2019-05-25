import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
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
    <HashRouter>
        <App />
    </HashRouter>
), document.getElementById('root'));
