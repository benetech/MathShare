import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import configureStore, { history } from './redux/configureStore';
import App from './components';
import 'jquery/dist/jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import './lib/mathlivedist/mathlive.core.css';
import './lib/mathlivedist/mathlive.css';
import './lib/font-awesome/css/font-awesome.min.css';
import './styles/styles.scss';

import '../images/favicon.png';

render((
    <Provider store={configureStore()}>
        <ConnectedRouter history={history}>
            <HashRouter>
                <App />
            </HashRouter>
        </ConnectedRouter>
    </Provider>
), document.getElementById('root'));
