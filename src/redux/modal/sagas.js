import {
    all,
    delay,
    fork,
    put,
    select,
    takeLatest,
} from 'redux-saga/effects';
import {
    updateActiveModals,
} from './actions';
import {
    updateTempSet,
} from '../problemList/actions';
import {
    getState,
} from './selectors';
import {
    matchCurrentRoute,
} from '../router/selectors';
import {
    getState as getProblemListState,
} from '../problemList/selectors';

import {
    ADD_PROBLEMS,
    CONFIRMATION,
    EDIT_PROBLEM,
    PALETTE_CHOOSER,
    TITLE_EDIT_MODAL,
} from '../../components/ModalContainer';
import { commonElementFinder } from '../../services/misc';

function* toggleModalSaga() {
    yield takeLatest('TOGGLE_MODALS', function* workerSaga({
        payload: {
            modals,
            index,
        },
    }) {
        const {
            activeModals,
        } = yield select(getState);
        const {
            set,
            problemToDeleteIndex,
            problemToEditIndex,
        } = yield select(getProblemListState);
        let updatedModals = activeModals.slice();
        const focusDict = {
            [ADD_PROBLEMS]: {
                selector: '#problem-new > button',
                isDismiss: true,
            },
            [PALETTE_CHOOSER]: {
                selector: '#add_problem_set',
                isDismiss: true,
            },
        };
        if (problemToDeleteIndex) {
            let gotoAfterDelete = problemToDeleteIndex;
            if (set.problems.length === gotoAfterDelete) {
                gotoAfterDelete = set.problems.length - 1;
            }
            focusDict[CONFIRMATION] = {
                selector: `#problem-dropdown-${gotoAfterDelete}`,
                isDismiss: true,
            };
        }
        if (problemToEditIndex) {
            focusDict[EDIT_PROBLEM] = {
                selector: `#problem-dropdown-${problemToEditIndex}`,
                isDismiss: true,
            };
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const modal of modals) {
            let isDismiss = false;
            if (updatedModals.indexOf(modal) !== -1) {
                isDismiss = true;
                updatedModals = updatedModals.filter(e => e !== modal);
            } else {
                if (modal === CONFIRMATION) {
                    yield put({
                        type: 'SET_PROBLEM_DELETE_INDEX',
                        payload: {
                            problemToDeleteIndex: index,
                        },
                    });
                } else if (modal === TITLE_EDIT_MODAL) {
                    const {
                        params,
                    } = yield select(matchCurrentRoute('/app/problemSet/:action'));
                    if (params.action !== 'new') {
                        yield put(updateTempSet({
                            title: set.title || '',
                        }));
                    }
                }
                updatedModals.push(modal);
            }
            if (focusDict[modal] && focusDict[modal].isDismiss === isDismiss) {
                setImmediate(() => {
                    commonElementFinder.tryToFind(focusDict[modal].selector);
                }, 0);
            }
        }
        yield delay(100);
        yield put(updateActiveModals(updatedModals));
    });
}

export default function* rootSaga() {
    yield all([
        fork(toggleModalSaga),
    ]);
}
