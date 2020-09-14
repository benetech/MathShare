import {
    all,
    delay,
    fork,
    put,
    select,
    take,
} from 'redux-saga/effects';
import {
    getState,
} from './selectors';
import {
    setDropdownId,
} from './actions';
import { announceOnAriaLive } from '../ariaLiveAnnouncer/actions';
import Locales from '../../strings';

function* closeDropdownSaga() {
    while (true) {
        const oldState = yield select(getState);
        if (oldState.dropdownOpen) {
            const dropdown = document.getElementById(oldState.dropdownOpen);
            if (!dropdown) {
                yield put(setDropdownId(null));
            }
        }
        yield delay(50);
    }
}

function* validateDropdownSaga() {
    while (true) {
        const oldState = yield select(getState);
        yield take('SET_DROPDOWN_ID');
        if (oldState.dropdownOpen) {
            const newState = yield select(getState);
            if (!newState.dropdownOpen && (
                !document.activeElement || !document.activeElement.ariaExpanded)) {
                yield put(announceOnAriaLive(Locales.strings.dropdown_collapsed));
            }
        }
    }
}

export default function* rootSaga() {
    yield all([
        fork(closeDropdownSaga),
        fork(validateDropdownSaga),
    ]);
}
