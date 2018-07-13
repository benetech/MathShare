import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from './components';
import 'jquery/dist/jquery';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import dataSet from './data/data01.json';

render((
/* TODO: dataset should be state so we can change it on the run */
  <HashRouter>
    <App dataSet={dataSet} />
  </HashRouter>
), document.getElementById('root'));
