import { push } from 'connected-react-router';
import {
    all,
    call,
    fork,
    put,
    // select,
    takeLatest,
} from 'redux-saga/effects';
import { archiveSolutionSetApi } from '../../../../src/redux/problemList/apis';
import { displayAlert } from '../../services/alerts';
import Locales from '../../strings';
import {
    archiveProblemSetApi,
    fetchExampleSetsApi,
    fetchRecentWorkApi,
    saveProblemSetApi,
} from './apis';
// import {
//     getState,
// } from './selectors';

function* requestExampleSetsSaga() {
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

function* requestRecentSetsSaga() {
    yield takeLatest('REQUEST_RECENT_SETS', function* workerSaga() {
        try {
            const { data: recentSolutionSets } = yield call(fetchRecentWorkApi('student'));
            const { data: recentProblemSets } = yield call(fetchRecentWorkApi('teacher'));

            yield put({
                type: 'REQUEST_RECENT_PROBLEM_SETS_SUCCESS',
                payload: {
                    recentProblemSets: {
                        data: recentProblemSets,
                        loading: false,
                    },
                },
            });
            yield put({
                type: 'REQUEST_RECENT_SOLUTION_SETS_SUCCESS',
                payload: {
                    recentSolutionSets: {
                        data: recentSolutionSets,
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

function* reqestDuplicateProblemSet() {
    yield takeLatest('DUPLICATE_PROBLEM_SET', function* workerSaga({
        payload,
    }) {
        try {
            let problems = payload.problems;
            if (payload.solutions) {
                problems = payload.solutions.map(solution => ({
                    ...solution.problem,
                    steps: solution.steps,
                }));
            }
            const setPayload = {
                ...payload,
                problems,
            };
            const {
                data,
            } = yield call(saveProblemSetApi, setPayload);
            const {
                editCode,
            } = data;

            window.open(`/#/app/problemSet/edit/${editCode}`, '_blank');
        } catch (error) {
            yield put({
                type: 'DUPLICATE_PROBLEM_SET_FAILURE',
                error,
            });
        }
    });
}

function* requestArchiveProblemSet() {
    yield takeLatest('ARCHIVE_PROBLEM_SET', function* workerSaga({
        payload: {
            editCode,
            archiveMode,
            title,
            isSolutionSet,
            goTo,
        },
    }) {
        try {
            if (isSolutionSet) {
                yield call(archiveSolutionSetApi, editCode, archiveMode);
            } else {
                yield call(archiveProblemSetApi, editCode, archiveMode);
            }
            yield put({
                type: 'ARCHIVE_PROBLEM_SET_SUCCESS',
                payload: {
                    editCode,
                    key: (archiveMode === 'archived' ? 'recentProblemSets' : 'archivedProblemSets'),
                },
            });
            if (isSolutionSet) {
                if (archiveMode === 'archived') {
                    displayAlert('success', Locales.strings.archived_solutiom_set.replace('{title}', title), Locales.strings.success);
                } else {
                    displayAlert('success', Locales.strings.restore_success.replace('{title}', title), Locales.strings.success);
                }
            } else if (archiveMode === 'archived') {
                displayAlert('success', Locales.strings.archived_problem_set.replace('{title}', title), Locales.strings.success);
            } else {
                displayAlert('success', Locales.strings.restore_success.replace('{title}', title), Locales.strings.success);
            }
            if (goTo) {
                yield put(push(goTo));
            }
        } catch (error) {
            if (isSolutionSet) {
                if (archiveMode === 'archived') {
                    displayAlert('error', Locales.strings.archived_solutiom_set_failure.replace('{title}', title), Locales.strings.failure);
                } else {
                    displayAlert('error', Locales.strings.restore_failure.replace('{title}', title), Locales.strings.failure);
                }
            } else if (archiveMode === 'archived') {
                displayAlert('error', Locales.strings.archived_problem_set_failure.replace('{title}', title), Locales.strings.failure);
            } else {
                displayAlert('error', Locales.strings.restore_failure.replace('{title}', title), Locales.strings.failure);
            }
        }
    });
}

export default function* rootSaga() {
    yield all([
        fork(requestArchiveProblemSet),
        fork(requestExampleSetsSaga),
        fork(requestRecentSetsSaga),
        fork(reqestDuplicateProblemSet),
    ]);
}
