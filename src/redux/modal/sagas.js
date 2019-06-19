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
    getState,
} from './selectors';

import {
    CONFIRMATION,
    ADD_PROBLEM_SET,
    EDIT_PROBLEM,
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
                if (modal === ADD_PROBLEM_SET) {
                    yield put({
                        type: 'RESET_TEMP_PROBLEMS',
                    });
                } else if (modal === CONFIRMATION) {
                    yield put({
                        type: 'SET_PROBLEM_DELETE_INDEX',
                        payload: {
                            problemToDeleteIndex: index,
                        },
                    });
                } else if (modal === EDIT_PROBLEM) {
                    yield put({
                        type: 'SET_EDIT_PROBLEM',
                        payload: {
                            problemToEditIndex: index,
                        },
                    });
                }
                updatedModals.push(modal);
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
