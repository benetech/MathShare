import {
    createStore,
    applyMiddleware,
    compose,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import {
    routerMiddleware,
} from 'connected-react-router';

import {
    createHashHistory,
} from 'history';

import createRootReducer from './reducers';
import rootSaga from './sagas';

export const history = createHashHistory();

export default function configureStore(preloadedState) {
    const sagaMiddleware = createSagaMiddleware();

    const middlewares = [sagaMiddleware];

    if (process.env.NODE_ENV === 'development') {
        middlewares.push(logger);
    }

    middlewares.push(routerMiddleware(history));
    const store = createStore(
        createRootReducer(history),
        preloadedState,
        compose(applyMiddleware(...middlewares)),
    );
    sagaMiddleware.run(rootSaga);
    return store;
}
