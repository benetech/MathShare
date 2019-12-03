import ReactGA from 'react-ga';
import {
    LOCATION_CHANGE,
} from 'connected-react-router';

const initialState = {
    current: window.location.hash,
    currentTitle: null,
    prev: null,
    prevReplaced: null,
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
        if (action === 'REPLACE') {
            return {
                ...state,
                prevReplaced: state.current,
                current: window.location.hash,
            };
        } if (action === 'POP') {
            return {
                ...state,
                prev: state.current,
                current: window.location.hash,
            };
        }
        return state;
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
