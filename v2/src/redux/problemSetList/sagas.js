import {
    all,
    call,
    fork,
    put,
    takeLatest,
} from 'redux-saga/effects';
import {
    fetchExampleSetsApi,
} from './apis';


function* requestExampleSetSaga() {
    yield takeLatest('REQUEST_EXAMPLE_SETS', function* workerSaga() {
        try {
            const response = yield call(fetchExampleSetsApi);
            const exampleProblemSets = response.data;

            yield put({
                type: 'REQUEST_EXAMPLE_SETS_SUCCESS',
                payload: {
                    exampleProblemSets: {
                        data: exampleProblemSets,
                        loading: false,
                    },
                },
            });
        } catch (error) {
            yield put({
                type: 'REQUEST_EXAMPLE_SETS_FAILURE',
                error,
            });
        }
    });
}


export default function* rootSaga() {
    yield all([
        fork(requestExampleSetSaga),
    ]);
}
