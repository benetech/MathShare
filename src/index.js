import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components';
import 'jquery/dist/jquery';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import dataSet from './data/data01.json';

render((
  <BrowserRouter>
    <App dataSet={dataSet} />
  </BrowserRouter>
), document.getElementById('root'));
