import {
    all,
    call,
    delay,
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
import { commonElementFinder } from '../../services/misc';
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
            action,
            isFirstRendering,
        },
    }) {
        const { pathname } = location;
        const routerState = yield select(getRouterHookState);
        const {
            prev,
            prevReplaced,
            xPath,
            isBack,
        } = routerState;
        let selector = `a[href='${prev}']`;
        let isXpath = false;
        if (prev === xPath.href) {
            isXpath = true;
            selector = xPath.path;
        }
        const problemEditMatch = prev && /\/#\/app\/problemSet\/edit\/[A-Z0-9]*/.exec(prev);
        if (prevReplaced && (
            prev.startsWith('/#/app/problemSet/solve/')
            || (problemEditMatch && problemEditMatch[0] === prev)
        )) {
            selector = `a[href='${prevReplaced}']`;
            if (prevReplaced === xPath.href) {
                isXpath = true;
                selector = xPath.path;
            } else {
                isXpath = false;
            }
        }
        let notAbleToFocus = true;
        if (action === 'POP' && isBack && !isFirstRendering) {
            if (window.location.hash.startsWith('#/app/problemSet/solve/')) {
                yield delay(800);
            }
            notAbleToFocus = !(yield call(commonElementFinder.tryToFind, selector, isXpath));
        }
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
