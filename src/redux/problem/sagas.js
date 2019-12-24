import {
    all,
    call,
    fork,
    put,
    select,
    takeLatest,
} from 'redux-saga/effects';
import {
    goBack,
} from 'connected-react-router';
import {
    setProblemNotFound,
    setSolutionData,
    updateProblemSolution,
    updateProblemStore,
} from './actions';
import {
    getState,
} from './selectors';
import {
    matchCurrentRoute,
} from '../router/selectors';
import {
    fetchProblemSolutionApi,
    updateProblemSolutionApi,
    updateProblemSolutionSetApi,
} from './apis';
import {
    updateProblemStepsInSet,
} from '../problemList/apis';
import {
    getState as getProblemListState,
} from '../problemList/selectors';
import {
    loadProblemSetSolutionByEditCode,
    updateReviewSolutions,
    toggleModals,
    setReviewSolutions,
    setProblemSetShareCode,
} from '../problemList/actions';
import {
    FRONTEND_URL,
} from '../../config';
import {
    alertSuccess,
    alertError,
} from '../../scripts/alert';
import Locales from '../../strings';

const SHARE_SET = 'shareSet';

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
                yield put({
                    type: 'PROCESS_FETCHED_PROBLEM',
                    payload: {
                        action,
                        solution: response.data,
                    },
                });
            }
            // yield put(push(`/app/problemSet/view/${revisionCode}`));
        } catch (error) {
            // dispatch a failure action to the store with the error
            yield put(setProblemNotFound());
        }
    });
}

function* processFetchedProblem() {
    yield takeLatest('PROCESS_FETCHED_PROBLEM', function* workerSaga({
        payload: {
            action,
            solution,
        },
    }) {
        yield put(updateProblemSolution(solution, true));
        const {
            theActiveMathField,
        } = yield select(getProblemListState);
        theActiveMathField.$latex(solution.steps[solution.steps.length - 1].stepValue);
        yield put(setSolutionData(solution, action));
        const {
            problemSetSolutionEditCode,
        } = solution;
        if (problemSetSolutionEditCode) {
            yield put(loadProblemSetSolutionByEditCode(problemSetSolutionEditCode));
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
        yield put(updateReviewSolutions(solutions));
    });
}

function* requestCommitProblemSolutionSaga() {
    yield takeLatest('REQUEST_COMMIT_PROBLEM_SOLUTION', function* workerSaga({
        payload: {
            redirectBack,
            shareModal,
        },
    }) {
        try {
            const {
                solution,
            } = yield select(getState);
            const problemListState = yield select(getProblemListState);
            let shareCode = '';
            const matchedRoute = yield select(
                matchCurrentRoute('/app/problemSet/:action/:editCode/:position'),
            );
            if (matchedRoute) {
                const { steps } = solution;
                const { params } = matchedRoute;
                const { editCode } = params;
                const problemId = solution.problem.id;
                const response = yield call(
                    updateProblemStepsInSet, editCode, problemId, steps,
                );
                if (response.status !== 201) {
                    alertError('Unable to save problem', 'Error');
                    return;
                }
            } else if (problemListState.editCode) {
                const payloadSolutions = problemListState.solutions.map((currentSolution) => {
                    if (currentSolution.problem.id === solution.problem.id) {
                        return solution;
                    }
                    return currentSolution;
                });
                const response = yield call(
                    updateProblemSolutionSetApi, problemListState.editCode, payloadSolutions,
                );
                if (response.status !== 200) {
                    alertError('Unable to save problem', 'Error');
                    return;
                }
                const {
                    reviewCode,
                    solutions,
                    editCode,
                    title,
                } = response.data;
                yield put(setReviewSolutions(solutions, reviewCode, editCode, title));
                yield put(setProblemSetShareCode(reviewCode));
                const updatedSolution = solutions.find(currentSolution => (
                    solution.problem.id === currentSolution.problem.id));
                if (updatedSolution) {
                    yield put(updateProblemSolution(updatedSolution));
                    shareCode = updatedSolution.shareCode;
                }
            } else {
                const response = yield call(
                    updateProblemSolutionApi, solution.editCode, solution,
                );
                if (response.status !== 201) {
                    alertError('Unable to update problem set solution', 'Error');
                    return;
                }
                yield put(updateProblemSolution(response.data));
                shareCode = response.data.shareCode;
            }
            let problemStorePayload = {
                stepsFromLastSave: JSON.parse(JSON.stringify(solution.steps)),
                lastSaved: (new Date().toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                })),
                isUpdated: false,
            };
            if (!shareModal) {
                problemStorePayload = {
                    ...problemStorePayload,
                    editLink: `${FRONTEND_URL}/app/problem/edit/${solution.editCode}`,
                    shareLink: `${FRONTEND_URL}/app/problem/view/${shareCode}`,
                };
            }
            yield put(updateProblemStore(problemStorePayload));

            alertSuccess(Locales.strings.problem_saved_success_message,
                Locales.strings.success);

            if (redirectBack) {
                yield put(goBack());
            }
            if (!matchedRoute && shareCode) {
                if (shareModal) {
                    yield put(updateProblemStore({
                        shareLink: `${FRONTEND_URL}/app/problem/view/${shareCode}`,
                    }));
                    yield put(toggleModals([SHARE_SET]));
                }
            }
        } catch (error) {
            // dispatch a failure action to the store with the error
            yield put({
                type: 'REQUEST_COMMIT_PROBLEM_SOLUTION_FAILURE',
                payload: {
                    error,
                },
            });
        }
    });
}

export default function* rootSaga() {
    yield all([
        fork(processFetchedProblem),
        fork(requestLoadProblemSaga),
        fork(updateProblemSolutionSaga),
        fork(requestCommitProblemSolutionSaga),
    ]);
}
