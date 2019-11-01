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
    TITLE_EDIT_MODAL,
} from '../../components/ModalContainer';

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
        // eslint-disable-next-line no-restricted-syntax
        for (const modal of modals) {
            if (updatedModals.indexOf(modal) !== -1) {
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
        }
        yield put(updateActiveModals(updatedModals));
        if (modals.includes(ADD_PROBLEMS)) {
            setTimeout(() => {
                const button = document.querySelector('#problem-new > button');
                if (button) {
                    button.focus();
                }
            }, 100);
        }
    });
}

export default function* rootSaga() {
    yield all([
        fork(toggleModalSaga),
    ]);
}
