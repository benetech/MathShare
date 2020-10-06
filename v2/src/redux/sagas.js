import {
    all,
} from 'redux-saga/effects';
import routerSagas from './router/sagas';
import uiSagas from './ui/sagas';
import userProfileSagas from './userProfile/sagas';
import problemSetListSaga from './problemSetList/sagas';

export default function* rootSaga() {
    yield all([
        problemSetListSaga(),
        routerSagas(),
        uiSagas(),
        userProfileSagas(),
    ]);
}
