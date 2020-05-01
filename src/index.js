import React from 'react';
import ReactDOM, { render } from 'react-dom';
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

const app = (
    <Provider store={configureStore()}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>
);

if (process.env.NODE_ENV === 'development') {
    import('react-axe').then((axe) => {
        axe.default(React, ReactDOM, 1000);
        render(app, document.getElementById('root'));
    });
} else {
    render(app, document.getElementById('root'));
}
