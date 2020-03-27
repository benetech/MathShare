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
import { commonFocusHandler } from '../../services/misc';
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
            if (prevReplaced !== '/#/userDetails') {
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
        const { pathname } = location;
        const {
            prev,
            prevReplaced,
            xPath,
        } = yield select(getRouterHookState);
        let selector = `a[href='${prev}']`;
        let isXpath = false;
        if (prev === xPath.href) {
            isXpath = true;
            selector = xPath.path;
        }
        if (prevReplaced && prev.startsWith('/#/app/problemSet/solve/')) {
            selector = `a[href='${prevReplaced}']`;
            if (prevReplaced === xPath.href) {
                isXpath = true;
                selector = xPath.path;
            } else {
                isXpath = false;
            }
        }
        const notAbleToFocus = yield call(commonFocusHandler.tryToFocus, selector, isXpath);
        if (notAbleToFocus && pathname !== '/') {
            yield call(focusOnMainContent);
        }
    });
}

export default function* rootSaga() {
    yield all([
        fork(changeTitleSaga),
        fork(changeRouteSaga),
    ]);
}
