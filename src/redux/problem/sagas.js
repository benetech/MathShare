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
    updateProblemSolution,
} from './actions';
import {
    setReviewSolutions,
} from '../problemList/actions';
import {
    getState as getProblemListState,
} from '../problemList/selectors';
import {
    fetchProblemSolutionApi,
} from './apis';

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
                yield put(updateProblemSolution(solution));
                const {
                    theActiveMathField,
                } = yield select(getProblemListState);
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

function* updateProblemSolutionSaga() {
    yield takeLatest('UPDATE_PROBLEM_SOLUTION', function* workerSaga({
        payload: {
            solution,
        },
    }) {
        const {
            problem,
        } = solution;
        const {
            solutions,
        } = yield select(getProblemListState);
        const solutionIndex = solutions.findIndex(
            sol => sol.problem.id === problem.id,
        );
        if (solutionIndex === -1) {
            solutions.push(solution);
        } else {
            solutions[solutionIndex] = solution;
        }
        yield put(setReviewSolutions(solutions));
    });
}

export default function* rootSaga() {
    yield all([
        fork(requestLoadProblemSaga),
        fork(updateProblemSolutionSaga),
    ]);
}
