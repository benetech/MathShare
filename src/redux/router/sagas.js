import {
    all,
    call,
    fork,
    put,
    select,
    takeLatest,
} from 'redux-saga/effects';

import {
    LOCATION_CHANGE,
} from 'connected-react-router';
import { announceOnAriaLive } from '../ariaLiveAnnouncer/actions';
import { focusOnMainContent } from '../../services/events';
import Locales from '../../strings';
import {
    getRouterHookState,
} from './selectors';
import {
    setTitle,
} from './actions';

function* changeTitleSaga() {
    yield takeLatest('CHANGE_TITLE', function* workerSaga({
        payload: {
            title,
        },
    }) {
        const { currentTitle, prevReplaced } = yield select(getRouterHookState);
        let newTitle = title;
        if (newTitle && newTitle.join) {
            newTitle = title.join('');
        }
        if (newTitle && currentTitle !== newTitle) {
            const announceTitle = newTitle.split(` - ${Locales.strings.mathshare_benetech}`)[0];
            if (prevReplaced !== '#/userDetails') {
                yield put(announceOnAriaLive(announceTitle));
            } else {
                yield put({
                    type: 'CLEAR_PREV_REPLACED',
                });
            }
            yield put(setTitle(newTitle));
        }
    });
}

function* changeRouteSaga() {
    yield takeLatest(LOCATION_CHANGE, function* workerSaga({
        payload: {
            location,
        },
    }) {
        if (location.pathname !== '/') {
            yield call(setTimeout, focusOnMainContent, 100);
        }
    });
}

export default function* rootSaga() {
    yield all([
        fork(changeTitleSaga),
        fork(changeRouteSaga),
    ]);
}
