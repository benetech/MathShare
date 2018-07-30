import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from './components';
import 'jquery/dist/jquery';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import dataSet1 from './data/data01.json';
import dataSet2 from './data/data02.json';
import dataSet3 from './data/data03.json';

render((
  <HashRouter>
    <App dataSets={[dataSet1, dataSet2, dataSet3]} />
  </HashRouter>
), document.getElementById('root'));
