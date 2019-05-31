import {
    all,
} from 'redux-saga/effects';
import problemListSagas from './problemList/sagas';

export default function* rootSaga() {
    yield all([
        problemListSagas(),
    ]);
}
