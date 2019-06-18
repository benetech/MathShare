import {
    all,
} from 'redux-saga/effects';
import problemSagas from './problem/sagas';
import problemListSagas from './problemList/sagas';

export default function* rootSaga() {
    yield all([
        problemListSagas(),
        problemSagas(),
    ]);
}
