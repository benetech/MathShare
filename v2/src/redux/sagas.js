import {
    all,
} from 'redux-saga/effects';
import problemSaga from './problem/sagas';
import problemSetSaga from './problemSet/sagas';
import problemSetListSaga from './problemSetList/sagas';
import routerSagas from './router/sagas';
import uiSagas from './ui/sagas';
import userProfileSagas from './userProfile/sagas';

export default function* rootSaga() {
    yield all([
        problemSaga(),
        problemSetListSaga(),
        problemSetSaga(),
        routerSagas(),
        uiSagas(),
        userProfileSagas(),
    ]);
}
