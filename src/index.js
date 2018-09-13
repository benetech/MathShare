import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from './components';
import 'jquery/dist/jquery';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'react-notifications/lib/notifications.css';
import 'bootstrap/dist/css/bootstrap.css';
import './lib/mathlivedist/mathlive.core.css';
import './lib/mathlivedist/mathlive.css';
import './lib/intro/minified/introjs.min.css';
import './lib/font-awesome/css/font-awesome.min.css';
import './styles/styles.css';

render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('root'));
