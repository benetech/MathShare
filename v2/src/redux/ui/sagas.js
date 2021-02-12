import {
    all,
    delay,
    fork,
    put,
    select,
    take,
    takeEvery,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import {
    getState,
} from './selectors';
import {
    scrollTo as scrollToAction,
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

function* gotoPageSaga() {
    yield takeEvery('GOTO_PAGE', function* workerSaga({
        payload: {
            page,
            scrollTo,
            waitForEvents,
        },
    }) {
        yield put(push(page));
        console.log('waitForEvents', waitForEvents);
        if (waitForEvents) {
            yield all(waitForEvents.map(take));
        }
        yield put(scrollToAction({
            scrollTo,
        }));
    });
}

function* scrollToPageSaga() {
    yield takeEvery('SCROLL_TO', function* workerSaga({
        payload: {
            scrollTo,
        },
    }) {
        const element = document.getElementById(scrollTo);
        if (element) {
            element.scrollIntoView();
        }
        yield put({
            type: 'SCROLL_TO_COMPLETED',
        });
    });
}

export default function* rootSaga() {
    yield all([
        fork(closeDropdownSaga),
        fork(gotoPageSaga),
        fork(scrollToPageSaga),
        fork(validateDropdownSaga),
    ]);
}
