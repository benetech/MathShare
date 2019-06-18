import {
    all,
    call,
    fork,
    put,
    select,
    takeLatest,
} from 'redux-saga/effects';
// import {
//     push,
// } from 'connected-react-router';
import {
    setProblemNotFound,
    setSolutionData,
} from './actions';
import {
    getState,
} from './selectors';
import {
    fetchProblemSolutionApi,
} from './apis';

import {
    updateSolution,
} from '../../services/review';

// axios.get(path)
// .then((response) => {
//     if (response.status !== 200) {
//         this.setState({ notFound: true });
//     } else {

//     }
// }).catch(() => {
//     this.setState({ notFound: true });
// });

function* requestLoadProblemSaga() {
    yield takeLatest('REQUEST_LOAD_PROBLEM', function* workerSaga({
        payload: {
            action,
            code,
        },
    }) {
        try {
            const response = yield call(fetchProblemSolutionApi, action, code);
            if (response.status !== 200) {
                yield put(setProblemNotFound());
            } else {
                const solution = response.data;
                updateSolution(solution);
                const {
                    theActiveMathField,
                } = yield select(getState);
                theActiveMathField.latex(solution.steps[solution.steps.length - 1].stepValue);
                yield put(setSolutionData(solution, action));
            }
            // yield put(push(`/app/problemSet/view/${revisionCode}`));
        } catch (error) {
            // dispatch a failure action to the store with the error
            yield put(setProblemNotFound());
        }
    });
}

export default function* rootSaga() {
    yield all([
        fork(requestLoadProblemSaga),
    ]);
}
