import {
    all,
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
    PALETTE_CHOOSER,
    TITLE_EDIT_MODAL,
} from '../../components/ModalContainer';
import { sleep } from '../../services/misc';

const MAX_TRIALS = 5;

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
                        set,
                    } = yield select(getProblemListState);
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
                const tryFocus = async (selector, sleepMs = 0, trial = 1) => {
                    await sleep(sleepMs);
                    if (trial > MAX_TRIALS) {
                        return false;
                    }
                    const button = document.querySelector(selector);
                    if (button) {
                        button.focus();
                    }
                    return document.activeElement !== button
                        && tryFocus(selector, sleepMs + 100, trial + 1);
                };
                setTimeout(() => {
                    tryFocus(focusDict[modal].selector);
                }, 0);
            }
        }
        yield put(updateActiveModals(updatedModals));
    });
}

export default function* rootSaga() {
    yield all([
        fork(toggleModalSaga),
    ]);
}
