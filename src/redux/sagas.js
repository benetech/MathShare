import {
    all,
} from 'redux-saga/effects';
import ltiSagas from './lti/sagas';
import modalSagas from './modal/sagas';
import problemSagas from './problem/sagas';
import problemListSagas from './problemList/sagas';
import routerSagas from './router/sagas';
import ttsSagas from './tts/sagas';
import uiSagas from './ui/sagas';
import useProfileSagas from './userProfile/sagas';

export default function* rootSaga() {
    yield all([
        ltiSagas(),
        modalSagas(),
        problemListSagas(),
        problemSagas(),
        routerSagas(),
        ttsSagas(),
        uiSagas(),
        useProfileSagas(),
    ]);
}
