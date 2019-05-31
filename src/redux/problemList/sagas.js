import {
    all,
    call,
    fork,
    put,
    select,
    takeLatest,
} from 'redux-saga/effects';
import {
    push,
} from 'connected-react-router';
import {
    saveProblems,
    setProblemSetShareCode,
    toggleModals,
} from './actions';
import {
    fetchDefaultRevisionApi,
    fetchProblemsByActionAndCodeApi,
    saveProblemSetApi,
    updateProblemsApi,
} from './apis';
import {
    getState,
} from './selectors';
import {
    ADD_PROBLEM_SET,
    SHARE_NEW_SET,
    SHARE_PROBLEM_SET,
} from '../../components/ModalContainer';
import scrollTo from '../../scripts/scrollTo';
import {
    createReviewProblemSetOnUpdate,
    getLocalSolutions,
    getSolutionObjectFromProblems,
    shareSolutions,
    storeSolutionsLocally,
} from '../../services/review';


function* requestDefaultRevisionSaga() {
    yield takeLatest('REQUEST_DEFAULT_REVISION', function* workerSaga() {
        try {
            const response = yield call(fetchDefaultRevisionApi);
            const revisionCode = response.data;

            // dispatch a success action to the store with the new dog
            yield put({
                type: 'REQUEST_DEFAULT_REVISION_SUCCESS',
                payload: {
                    revisionCode,
                },
            });
            yield put(push(`/problemSet/view/${revisionCode}`));
        } catch (error) {
            // dispatch a failure action to the store with the error
            yield put({
                type: 'REQUEST_DEFAULT_REVISION_FAILURE',
                error,
            });
        }
    });
}

function* requestProblemSetByCode() {
    yield takeLatest('REQUEST_PROBLEM_SET', function* workerSaga({
        payload: {
            action,
            code,
        },
    }) {
        try {
            const response = yield call(fetchProblemsByActionAndCodeApi, action, code);
            if (response.status !== 200) {
                yield put({
                    type: 'REQUEST_PROBLEM_SET_FAILURE',
                });
                return;
            }
            const {
                solutions,
                problems,
                editCode,
                shareCode,
            } = response.data;
            if (action === 'review') {
                storeSolutionsLocally(action, code, solutions);
                yield put({
                    type: 'REQUEST_PROBLEM_SET_SUCCESS',
                    payload: {
                        problems: solutions.map(solution => solution.problem),
                        shareCode: code,
                    },
                });
            } else {
                const orderedProblems = problems.map((problem, position) => ({
                    ...problem,
                    position,
                }));
                const {
                    problemSetRevisionShareCode,
                } = orderedProblems[0];
                const existingSolutions = getLocalSolutions('view', problemSetRevisionShareCode);
                if (!existingSolutions || existingSolutions.length === 0) {
                    const storedSolutions = getSolutionObjectFromProblems(orderedProblems);
                    storeSolutionsLocally('view', problemSetRevisionShareCode, storedSolutions);
                    yield call(shareSolutions, 'view', problemSetRevisionShareCode);
                }
                yield put({
                    type: 'REQUEST_PROBLEM_SET_SUCCESS',
                    payload: {
                        problems: orderedProblems,
                        editCode,
                        shareCode,
                    },
                });
            }
        } catch (error) {
            yield put({
                type: 'REQUEST_PROBLEM_SET_FAILURE',
            });
        }
    });
}

function* addProblemSaga() {
    yield takeLatest('REQUEST_ADD_PROBLEM', function* workerSaga({
        payload: {
            imageData,
            text,
            index,
            newProblemSet,
        },
    }) {
        try {
            const {
                theActiveMathField,
            } = yield select(getState);

            const problem = {
                text: theActiveMathField.latex(),
                title: text,
                scratchpad: imageData,
                position: index,
            };

            if (newProblemSet) {
                yield put({
                    type: 'ADD_TEMP_PROBLEM',
                    payload: {
                        problem,
                    },
                });
            } else {
                yield put({
                    type: 'ADD_PROBLEM',
                    payload: {
                        problem,
                    },
                });
                yield put(saveProblems());
            }

            theActiveMathField.latex('$$$$');

            // mathLive.renderMathInDocument();
            scrollTo('container', 'myWorkFooter');

            // dispatch a success action to the store with the new dog
            yield put({
                type: 'SAVE_PROBLEM_SUCCESS',
            });
        } catch (error) {
            // dispatch a failure action to the store with the error
            yield put({
                type: 'SAVE_PROBLEM_FAILURE',
                error,
            });
        }
    });
}

function* requestSaveProblemsSaga() {
    yield takeLatest('REQUEST_SAVE_PROBLEMS', function* workerSaga({
        payload: {
            newProblems,
        },
    }) {
        try {
            const {
                set,
            } = yield select(getState);

            const response = yield call(
                updateProblemsApi, set.editCode, set.shareCode, newProblems || set.problems,
            );

            const {
                editCode,
                shareCode,
                problems,
            } = response.data;
            // might not be required on save after deleted
            createReviewProblemSetOnUpdate(problems, shareCode);
            yield put({
                type: 'REQUEST_SAVE_PROBLEMS_SUCCESS',
                payload: {
                    problems,
                    editCode,
                    shareCode,
                },
            });
        } catch (error) {
            // dispatch a failure action to the store with the error
            yield put({
                type: 'REQUEST_SAVE_PROBLEMS_FAILURE',
                error,
            });
        }
    });
}

function* requestDeleteProblemSaga() {
    yield takeLatest('REQUEST_DELETE_PROBLEM', function* workerSaga() {
        try {
            const {
                problemToDeleteIndex,
                set,
            } = yield select(getState);

            const updatedProblems = set.problems.splice(problemToDeleteIndex, 1);
            yield put(saveProblems(updatedProblems));
        } catch (error) {
            // dispatch a failure action to the store with the error
            yield put({
                type: 'REQUEST_DELETE_PROBLEM_FAILURE',
                error,
            });
        }
    });
}

function* requestEditProblemSaga() {
    yield takeLatest('REQUEST_EDIT_PROBLEM', function* workerSaga({
        payload: {
            imageData,
            title,
        },
    }) {
        try {
            const {
                problemToEditIndex,
                set,
                theActiveMathField,
            } = yield select(getState);

            yield put(saveProblems(set.problems.map((problem, index) => {
                if (index === problemToEditIndex) {
                    return {
                        ...problem,
                        title,
                        scratchpad: imageData,
                        text: theActiveMathField.latex(),
                    };
                }
                return problem;
            })));
        } catch (error) {
            // dispatch a failure action to the store with the error
            yield put({
                type: 'REQUEST_EDIT_PROBLEM_FAILURE',
                error,
            });
        }
    });
}

function* requestShareSolutionsSaga() {
    yield takeLatest('REQUEST_SHARE_SOLUTIONS', function* workerSaga({
        payload: {
            action,
            code,
        },
    }) {
        try {
            const {
                reviewCode,
            } = yield call(shareSolutions, action, code);
            yield put(setProblemSetShareCode(reviewCode));
            yield put(toggleModals([SHARE_PROBLEM_SET]));
        } catch (error) {
            // dispatch a failure action to the store with the error
            yield put({
                type: 'REQUEST_SHARE_SOLUTIONS_FAILURE',
                error,
            });
        }
    });
}

function* requestSaveProblemSetSaga() {
    yield takeLatest('REQUEST_SAVE_PROBLEM_SET', function* workerSaga({
        payload: {
            problems,
        },
    }) {
        try {
            const {
                tempPalettes,
            } = yield select(getState);
            const set = {
                problems,
                palettes: tempPalettes,
            };
            const {
                data,
            } = yield call(saveProblemSetApi, set);
            const {
                shareCode,
            } = data;
            yield put({
                type: 'REQUEST_SAVE_PROBLEM_SET_SUCCESS',
                payload: {
                    shareCode,
                },
            });
            yield put(toggleModals([ADD_PROBLEM_SET, SHARE_NEW_SET]));
        } catch (error) {
            // dispatch a failure action to the store with the error
            yield put({
                type: 'REQUEST_SAVE_PROBLEM_SET_FAILURE',
                error,
            });
        }
    });
}


export default function* rootSaga() {
    yield all([
        fork(addProblemSaga),
        fork(requestDeleteProblemSaga),
        fork(requestDefaultRevisionSaga),
        fork(requestProblemSetByCode),
        fork(requestSaveProblemsSaga),
        fork(requestEditProblemSaga),
        fork(requestShareSolutionsSaga),
        fork(requestSaveProblemSetSaga),
    ]);
}
