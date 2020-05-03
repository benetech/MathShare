import ReactGA from 'react-ga';
import {
    LOCATION_CHANGE,
} from 'connected-react-router';

const initialState = {
    current: window.location.hash,
    currentTitle: null,
    prev: null,
    prevReplaced: null,
    xPath: {
        path: null,
        href: null,
    },
    historyStack: [],
};

const router = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case LOCATION_CHANGE: {
        const { action } = payload;
        ReactGA.pageview(
            payload.location.pathname,
        );
        const hashPath = `/#${payload.location.pathname}`;
        let historyStack = state.historyStack;
        const isBack = (
            historyStack.length > 1 && historyStack[historyStack.length - 2] === hashPath
        );
        if (action === 'REPLACE'
            || (
                historyStack.length > 1
                && historyStack[historyStack.length - 2] === hashPath
            )) {
            historyStack = state.historyStack.filter(
                (_, index) => index !== (historyStack.length - 1),
            );
        } else {
            historyStack = [...state.historyStack, hashPath];
        }
        if (action === 'REPLACE') {
            historyStack = [...historyStack, hashPath];
            return {
                ...state,
                prevReplaced: state.current,
                current: `/${window.location.hash}`,
                historyStack,
            };
        } if (action === 'POP') {
            return {
                ...state,
                prev: state.current,
                isBack,
                current: `/${window.location.hash}`,
                historyStack,
            };
        }
        return state;
    }
    case 'STORE_X_PATH': {
        return {
            ...state,
            xPath: payload,
        };
    }
    case 'SET_TITLE': {
        const { title } = payload;
        return {
            ...state,
            currentTitle: title,
        };
    }
    case 'CLEAR_PREV_REPLACED':
        return {
            ...state,
            prevReplaced: null,
        };
    default:
        return state;
    }
};

export default router;
