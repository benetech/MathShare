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
    replace,
    goBack,
} from 'connected-react-router';
import {
    resetProblemSet,
    saveProblems,
    setProblemSetShareCode,
    // toggleModals,
    updateProblemList,
    updateTempSet,
    finishEditing,
    updateSet,
    shareSolutions as shareSolutionsAction,
    setReviewSolutions,
    requestProblemSetSuccess,
    updateProblemSetPayload,
} from './actions';
import {
    updateProblemStore,
} from '../problem/actions';
import {
    fetchEditableProblemSetSolutionApi,
    fetchPartnerSubmitOptionsApi,
    fetchProblemsByActionAndCodeApi,
    saveProblemSetApi,
    updateProblemsApi,
    // submitToPartnerApi,
} from './apis';
import {
    getState,
} from './selectors';
import {
    matchCurrentRoute,
} from '../router/selectors';
// import {
//     getState as getModalState,
// } from '../modal/selectors';
// import {
//     getState as getStateFromUserProfile,
// } from '../userProfile/selectors';
// import {
//     ADD_PROBLEM_SET,
//     SHARE_NEW_SET,
//     SHARE_PROBLEM_SET,
// } from '../../components/ModalContainer';
// import scrollTo from '../../scripts/scrollTo';
// import {
//     alertSuccess,
//     alertError,
// } from '../../scripts/alert';
import {
    getSolutionObjectFromProblems,
    shareSolutions,
} from '../../services/review';
// import {
//     renderShareToClassroom,
// } from '../../services/googleClassroom';
import Locales from '../../strings';
import { displayAlert } from '../../services/alerts';


function* requestProblemSetByCode() {
    yield takeLatest('REQUEST_PROBLEM_SET', function* workerSaga({
        payload: {
            action,
            code,
            position,
        },
    }) {
        try {
            if (action === 'solve') {
                return;
            }
            const response = yield call(fetchProblemsByActionAndCodeApi, action, code);
            if (response.status > 400) {
                yield put(push('/app/'));
                yield put({
                    type: 'REQUEST_PROBLEM_SET_FAILURE',
                });
                displayAlert('error', 'Unable to load problem set');
                return;
            }
            const {
                id,
                solutions,
                problems,
                reviewCode,
                editCode,
                shareCode,
                title,
                palettes,
                archiveMode,
                source,
                optionalExplanations,
                hideSteps,
            } = response.data;
            if (action === 'review') {
                yield put(
                    setReviewSolutions(
                        id, solutions, reviewCode, editCode, title, archiveMode, source,
                    ),
                );
                // yield put({
                //     type: 'REQUEST_PROBLEM_SET_SUCCESS',
                //     payload: {
                //         problems: solutions.map(solution => solution.problem),
                //         shareCode: reviewCode,
                //         title,
                //     },
                // });
            } else {
                const orderedProblems = problems.sort((a, b) => {
                    if (a.position === b.position) {
                        return (a.id - b.id);
                    }
                    return (a.position - b.position);
                }).map((problem, index) => ({
                    ...problem,
                    position: index,
                }));
                yield put(requestProblemSetSuccess({
                    problems: orderedProblems,
                    editCode,
                    shareCode,
                    title,
                    palettes,
                    archiveMode,
                    source,
                    optionalExplanations,
                    hideSteps,
                }));
                if (action === 'view') {
                    yield put(shareSolutionsAction(action, code, true));
                } else if (action === 'edit') {
                    // renderShareToClassroom(
                    //     'shareInClassroom',
                    //     `/#/app/problemSet/view/${shareCode}`, {
                    //         title,
                    //     },
                    // );
                    if (position && orderedProblems.length > 0) {
                        const selectedProblem = orderedProblems.find(
                            problem => String(problem.position) === position,
                        );
                        if (!selectedProblem) {
                            yield put(goBack());
                            yield put({
                                type: 'REQUEST_PROBLEM_SET_FAILURE',
                            });
                            displayAlert('error', 'Unable to edit problem');
                        }
                        let steps = [{
                            explanation: selectedProblem.title,
                            stepValue: selectedProblem.text,
                            deleted: false,
                            cleanup: null,
                            scratchpad: null,
                        }];
                        if (selectedProblem.steps && selectedProblem.steps.length > 0) {
                            steps = selectedProblem.steps;
                        }
                        yield put({
                            type: 'PROCESS_FETCHED_PROBLEM',
                            payload: {
                                action,
                                solution: {
                                    problem: selectedProblem,
                                    editCode: null,
                                    shareCode: null,
                                    problemSetSolutionEditCode: null,
                                    steps,
                                    palettes,
                                },
                            },
                        });
                    }
                }
            }
        } catch (error) {
            yield put(push('/app/'));
            yield put({
                type: 'REQUEST_PROBLEM_SET_FAILURE',
            });
            displayAlert('error', 'Unable to load problem set');
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
                text: theActiveMathField.$latex(),
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
                yield put({
                    type: 'SAVE_PROBLEM_SUCCESS',
                });
                yield put(updateProblemStore({
                    textAreaValue: '',
                }));
                yield put({
                    type: 'CLEAR_SCRATCH_PAD_CONTENT',
                });
            }

            theActiveMathField.$latex('$$$$');

            // mathLive.renderMathInDocument();
            // scrollTo('container', 'myWorkFooter');
        } catch (error) {
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
                params,
            } = yield select(matchCurrentRoute('/app/problemSet/:action'));
            if (params && params.action === 'new') {
                yield put(updateTempSet({
                    problems: newProblems,
                }));
                return;
            }
            if (newProblems) {
                yield put(updateProblemList(newProblems));
            }

            const {
                set,
            } = yield select(getState);

            yield put(updateProblemSetPayload({
                problems: newProblems || set.problems,
            }));
        } catch (error) {
            yield put({
                type: 'REQUEST_SAVE_PROBLEMS_FAILURE',
                error,
            });
        }
    });
}

function* requestUpdateProblemsSaga() {
    yield takeLatest('REQUEST_UPDATE_PROBLEMS', function* workerSaga({
        payload: {
            updatePayload,
            successMsg,
            errorMsg,
        },
    }) {
        try {
            const {
                set,
            } = yield select(getState);

            const response = yield call(
                updateProblemsApi, {
                    ...set,
                    ...updatePayload,
                },
            );

            // might not be required on save after deleted
            yield put({
                type: 'REQUEST_SAVE_PROBLEMS_SUCCESS',
                payload: response.data,
            });
            // renderShareToClassroom(
            //     'shareInClassroom',
            //     `/#/app/problemSet/view/${shareCode}`, {
            //         title: set.title,
            //     },
            // );
            if (successMsg) {
                displayAlert('success', successMsg, Locales.strings.success);
            }
        } catch (error) {
            yield put({
                type: 'REQUEST_SAVE_PROBLEMS_FAILURE',
                error,
            });
            if (errorMsg) {
                displayAlert('error', errorMsg, Locales.strings.failure);
            }
        }
    });
}

function* requestDeleteProblemSaga() {
    yield takeLatest('REQUEST_DELETE_PROBLEM', function* workerSaga() {
        try {
            const {
                problemToDeleteIndex,
                set,
                tempSet,
            } = yield select(getState);

            const {
                params,
            } = yield select(matchCurrentRoute('/app/problemSet/:action'));
            if (params && params.action === 'new') {
                yield put(updateTempSet({
                    problems: tempSet.problems.filter(
                        (_problem, index) => index !== problemToDeleteIndex,
                    ),
                }));
            } else {
                const updatedProblems = set.problems.filter(
                    (_problem, index) => index !== problemToDeleteIndex,
                );
                yield put(saveProblems(updatedProblems));
            }
        } catch (error) {
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
                tempSet,
                theActiveMathField,
            } = yield select(getState);

            const {
                params,
            } = yield select(matchCurrentRoute('/app/problemSet/:action'));
            if (params && params.action === 'new') {
                yield put(updateTempSet({
                    problems: tempSet.problems.map((problem, index) => {
                        if (index === problemToEditIndex) {
                            return {
                                ...problem,
                                title,
                                scratchpad: imageData,
                                text: theActiveMathField.$latex(),
                            };
                        }
                        return problem;
                    }),
                }));
            } else {
                yield put(saveProblems(set.problems.map((problem, index) => {
                    if (index === problemToEditIndex) {
                        return {
                            ...problem,
                            title,
                            scratchpad: imageData,
                            text: theActiveMathField.$latex(),
                        };
                    }
                    return problem;
                })));
            }
        } catch (error) {
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
            silent,
        },
    }) {
        try {
            if (action === 'edit') {
                const {
                    set,
                    newSetSharecode,
                } = yield select(getState);

                const payloadSolutions = getSolutionObjectFromProblems(set.problems);
                const {
                    reviewCode,
                } = yield call(shareSolutions, newSetSharecode, payloadSolutions);
                yield put(setProblemSetShareCode(reviewCode));
            } else if (action !== 'solve') {
                const {
                    set,
                } = yield select(getState);

                const payloadSolutions = getSolutionObjectFromProblems(set.problems);
                const {
                    id,
                    reviewCode,
                    solutions,
                    editCode,
                    title,
                    archiveMode,
                    source,
                } = yield call(shareSolutions, code, payloadSolutions);
                if (silent) {
                    yield put(replace(`/app/problemSet/solve/${editCode}`));
                }
                yield put(
                    setReviewSolutions(
                        id, solutions, reviewCode, editCode, title, archiveMode, source,
                    ),
                );
                yield put(setProblemSetShareCode(reviewCode));
            }

            // if (!silent) {
            //     yield put(toggleModals([SHARE_PROBLEM_SET]));
            // }
        } catch (error) {
            console.log('error', error);
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
            title,
            redirect,
        },
    }) {
        try {
            const match = yield select(matchCurrentRoute('/app/problemSet/:action'));
            if (match) {
                const {
                    params,
                } = match;
                if (params && params.action === 'edit') {
                    yield put(finishEditing(redirect));
                    return;
                }
            }

            const {
                tempPalettes,
            } = yield select(getState);
            yield put(resetProblemSet());
            const set = {
                problems,
                title,
                palettes: tempPalettes,
                hideSteps: true,
                optionalExplanations: true,
            };
            const {
                data,
            } = yield call(saveProblemSetApi, set);
            const {
                editCode,
                shareCode,
            } = data;
            yield put({
                type: 'REQUEST_SAVE_PROBLEM_SET_SUCCESS',
                payload: {
                    editCode,
                    shareCode,
                },
            });

            if (redirect !== null) {
                if (redirect) {
                    yield put(push(`/app/problemSet/view/${shareCode}`));
                } else {
                    yield put(push(`/app/problemSet/edit/${editCode}`));
                }
                displayAlert('success', Locales.strings.created_problem_set, Locales.strings.success);
            } else {
                yield put(push(`/app/problemSet/edit/${editCode}`));
            }
        } catch (error) {
            yield put({
                type: 'REQUEST_SAVE_PROBLEM_SET_FAILURE',
                error,
            });
            displayAlert('error', Locales.strings.failure_in_creating_problem_set, Locales.strings.failure);
        }
    });
}

function* requestFinishEditingSaga() {
    yield takeLatest('FINISH_EDITING', function* workerSaga({
        payload: {
            redirect,
        },
    }) {
        try {
            const {
                set: {
                    shareCode,
                },
            } = yield select(getState);
            if (redirect) {
                yield put(push(`/app/problemSet/view/${shareCode}`));
            // } else {
            //     yield put(toggleModals([SHARE_NEW_SET]));
            }
        } catch (error) {
            yield put({
                type: 'FINISH_EDITING_FAILURE',
                error,
            });
        }
    });
}

function* requestUpdateTitleSaga() {
    yield takeLatest('UPDATE_PROBLEM_SET_TITLE', function* workerSaga({
        payload: {
            title,
        },
    }) {
        try {
            const {
                params,
            } = yield select(matchCurrentRoute('/app/problemSet/:action/:code?'));
            if (params && params.action === 'new') {
                yield put(updateTempSet({
                    title,
                }));
            } else {
                yield put(updateSet({
                    title,
                }));
                yield put(saveProblems());
            }
        } catch (error) {
            yield put({
                type: 'UPDATE_PROBLEM_SET_TITLE_FAILURE',
                error,
            });
        }
    });
}

function* requestLoadProblemSetSolution() {
    yield takeLatest('LOAD_PROBLEM_SET_SOLUTION_BY_EDIT_CODE', function* workerSaga({
        payload: {
            editCode,
        },
    }) {
        try {
            const response = yield call(fetchEditableProblemSetSolutionApi, editCode);
            if (response.status !== 200) {
                displayAlert('error', 'Unable to find problem set');
                yield put(push('/app'));
            }
            const {
                data,
            } = response;
            const {
                id,
                solutions,
                reviewCode,
                title,
                archiveMode,
                source,
            } = data;
            yield put(
                setReviewSolutions(id, solutions, reviewCode, editCode, title, archiveMode, source),
            );
            yield put(setProblemSetShareCode(reviewCode));
        } catch (error) {
            yield put({
                type: 'LOAD_PROBLEM_SET_SOLUTION_BY_EDIT_CODE_FAILURE',
                error,
            });
        }
    });
}

function* requestPartnerSubmitOptions() {
    yield takeLatest('SET_REVIEW_SOLUTIONS', function* workerSaga({
        payload: {
            source,
        },
    }) {
        if (!source) { return; }
        try {
            const response = yield call(fetchPartnerSubmitOptionsApi, source);
            if (response.status === 200) {
                yield put({
                    type: 'PARTNER_SUBMIT_OPTIONS_SUCCESS',
                    payload: response.data,
                });
            }
        } catch (error) {
            console.log('error', error);
        }
    });
}

// function* requestSubmitToPartner() {
//     yield takeLatest('REQUEST_SUBMIT_TO_PARTNER', function* workerSaga({
//         payload: {
//             id,
//             editCode,
//             shareCode,
//         },
//     }) {
//         let success = false;
//         try {
//             const response = yield call(submitToPartnerApi, id, editCode, shareCode);
//             success = response.status === 200;
//         } catch (error) {
//             success = false;
//         }
//         if (success) {
//             alertSuccess(Locales.strings.submit_to_partner_success, Locales.strings.success);
//         } else {
//             alertError(Locales.strings.submit_to_partner_failure, Locales.strings.failure);
//         }
//     });
// }

export default function* rootSaga() {
    yield all([
        fork(addProblemSaga),
        fork(requestDeleteProblemSaga),
        fork(requestProblemSetByCode),
        fork(requestSaveProblemsSaga),
        fork(requestEditProblemSaga),
        fork(requestShareSolutionsSaga),
        fork(requestSaveProblemSetSaga),
        fork(requestUpdateProblemsSaga),
        fork(requestFinishEditingSaga),
        fork(requestUpdateTitleSaga),
        fork(requestLoadProblemSetSolution),
        fork(requestPartnerSubmitOptions),
        // fork(requestSubmitToPartner),
    ]);
}
