import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import configureStore, { history } from './redux/configureStore';
import App from './pages';
import ScrollToTop from './components/ScrollToTop';

import '../../images/favicon.png';

const app = (
    <Provider store={configureStore()}>
        <ConnectedRouter history={history}>
            <ScrollToTop>
                <App />
            </ScrollToTop>
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
