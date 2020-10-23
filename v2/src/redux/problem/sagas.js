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
    replace,
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
} from '../problemSet/apis';
import {
    getState as getProblemSetState,
} from '../problemSet/selectors';
import {
    loadProblemSetSolutionByEditCode,
    updateReviewSolutions,
    setReviewSolutions,
    setProblemSetShareCode,
} from '../problemSet/actions';
import {
    FRONTEND_URL,
} from '../../config';
import Locales from '../../strings';
import MathButton from '../../components/MathPalette/components/MathButtonsGroup/components/MathButtonsRow/components/MathButton';
import { displayAlert } from '../../services/alerts';

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
                const { data } = response;
                if (action === 'view') {
                    data.shareCode = code;
                }
                yield put({
                    type: 'PROCESS_FETCHED_PROBLEM',
                    payload: {
                        action,
                        solution: data,
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
        const { editorPosition } = solution;
        yield put(updateProblemSolution(solution, true));
        const {
            theActiveMathField,
        } = yield select(getProblemSetState);
        let stepListPosition = solution.steps.length - 1;
        if (editorPosition !== null && editorPosition > -1 && solution.steps.length > 0) {
            const inProgressSteps = solution.steps.filter(step => step.inProgress);
            if (inProgressSteps.count > 1) {
                stepListPosition = -1;
                let currentCount = -1;
                for (let index = 0; index < solution.steps.length; index += 1) {
                    const step = solution.steps[index];
                    stepListPosition += 1;
                    currentCount += 1;
                    if (step.cleanup !== null) {
                        currentCount += 1;
                    }
                    if (editorPosition < currentCount) {
                        if (step.cleanup !== null) {
                            stepListPosition += 1;
                        }
                        break;
                    }
                }
            } else {
                stepListPosition = solution.steps.findIndex(step => step.inProgress);
            }
        }
        if (theActiveMathField) {
            theActiveMathField.$latex(solution.steps[stepListPosition].stepValue);
        }
        if (solution.steps[stepListPosition].inProgress) {
            yield put(updateProblemStore({
                textAreaValue: solution.steps[stepListPosition].explanation,
            }));
        }
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
        } = yield select(getProblemSetState);
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
            redirectTo,
            shareModal,
            finished,
        },
    }) {
        try {
            const {
                solution,
                textAreaValue,
                work,
                editorPosition,
                editing,
            } = yield select(getState);
            let finalEditorPosition = editorPosition;
            const {
                theActiveMathField,
            } = yield select(getProblemSetState);
            let steps = solution.steps.slice();
            const editorMath = theActiveMathField.$latex();
            let lastStep = null;
            if (steps.length > 0) {
                if (editing && editorPosition !== null && editorPosition > -1) {
                    lastStep = steps.splice(editorPosition, 0).pop();
                }
                if (!lastStep) {
                    lastStep = steps[steps.length - 1];
                }
            }
            steps = steps.filter(step => !step.inProgress);
            if (textAreaValue
                || (lastStep && textAreaValue.trim() !== lastStep.explanation)
                || (
                    lastStep && editorMath.trim()
                    && (
                        editorMath !== lastStep.stepValue
                        && editorMath !== lastStep.cleanup
                    )
                )) {
                const stepValue = theActiveMathField.$latex();
                const cleanup = MathButton.CleanUpCrossouts(stepValue);
                steps.splice(editorPosition + 1, 0, {
                    scratchpad: work.scratchpadContent,
                    explanation: textAreaValue,
                    stepValue,
                    cleanup: (cleanup === stepValue) ? null : cleanup,
                    inProgress: true,
                });
            } else {
                finalEditorPosition = steps.length;
            }
            const inProgressStep = steps && steps.find(step => step.inProgress);
            const problemListState = yield select(getProblemSetState);
            let shareCode = '';
            const matchedRoute = yield select(
                matchCurrentRoute('/app/problemSet/:action/:editCode/:position'),
            );
            if (matchedRoute) {
                const { params } = matchedRoute;
                const { editCode } = params;
                const payload = {
                    id: solution.problem.id,
                    editorPosition: (editing && inProgressStep) ? editorPosition : null,
                    steps,
                };
                const response = yield call(
                    updateProblemStepsInSet, editCode, payload,
                );
                if (response.status !== 201) {
                    displayAlert('error', 'Unable to save problem', 'Error');
                    return;
                }
                yield put({
                    type: 'REQUEST_SAVE_PROBLEMS_SUCCESS',
                    payload: response.data,
                });
            } else if (problemListState.editCode) {
                const payloadSolutions = problemListState.solutions.map((currentSolution) => {
                    if (currentSolution.problem.id === solution.problem.id) {
                        return {
                            ...solution,
                            steps,
                            finished: finished || solution.finished,
                            editorPosition: (editing && inProgressStep) ? editorPosition : null,
                        };
                    }
                    return currentSolution;
                });
                const response = yield call(
                    updateProblemSolutionSetApi, problemListState.editCode, payloadSolutions,
                );
                if (response.status !== 200) {
                    displayAlert('error', 'Unable to save problem', 'Error');
                    return;
                }
                const {
                    id,
                    archiveMode,
                    reviewCode,
                    solutions,
                    editCode,
                    title,
                    source,
                } = response.data;
                yield put(
                    setReviewSolutions(
                        id, solutions, reviewCode, editCode, title, archiveMode, source,
                    ),
                );
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
                    displayAlert('error', 'Unable to update problem set solution', 'Error');
                    return;
                }
                yield put(updateProblemSolution(response.data));
                shareCode = response.data.shareCode;
            }
            const currentProblemStore = yield select(getState);
            let problemStorePayload = {
                stepsFromLastSave: JSON.parse(JSON.stringify(steps)),
                lastSaved: (new Date().toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                })),
                isUpdated: false,
            };
            if (!shareModal) {
                problemStorePayload = {
                    solution: {
                        ...currentProblemStore.solution,
                        steps: problemStorePayload.stepsFromLastSave,
                    },
                    ...problemStorePayload,
                    editLink: `${FRONTEND_URL}/app/problem/edit/${solution.editCode}`,
                    shareLink: `${FRONTEND_URL}/app/problem/view/${shareCode}`,
                    editorPosition: editing ? editorPosition : finalEditorPosition,
                    textAreaValue: inProgressStep ? textAreaValue : '',
                };
            }
            yield put(updateProblemStore(problemStorePayload));

            displayAlert('success', Locales.strings.problem_saved_success_message,
                Locales.strings.success);

            if (redirectTo === 'back') {
                yield put(goBack());
            } else if (typeof (redirectTo) === 'string') {
                const { scratchPadPainterro } = work;
                if (scratchPadPainterro) {
                    scratchPadPainterro.clear();
                }
                yield put(replace(redirectTo));
            }
            if (!matchedRoute && shareCode) {
                if (shareModal) {
                    yield put(updateProblemStore({
                        shareLink: `${FRONTEND_URL}/app/problem/view/${shareCode}`,
                    }));
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
