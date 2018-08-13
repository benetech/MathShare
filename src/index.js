import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from './components';
import 'jquery/dist/jquery';
import 'bootstrap/dist/js/bootstrap.bundle.js';

render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('root'));
