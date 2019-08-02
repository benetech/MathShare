import {
    all,
} from 'redux-saga/effects';
import modalSagas from './modal/sagas';
import problemSagas from './problem/sagas';
import problemListSagas from './problemList/sagas';
import useProfileSagas from './userProfile/sagas';

export default function* rootSaga() {
    yield all([
        modalSagas(),
        problemListSagas(),
        problemSagas(),
        useProfileSagas(),
    ]);
}
