import ReactGA from 'react-ga';
import {
    LOCATION_CHANGE,
} from 'connected-react-router';

const initialState = {
    current: window.location.href,
    prev: null,
};

const problems = (state = initialState, {
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
                current: window.location.href,
            };
        } if (action === 'POP') {
            return {
                ...state,
                prev: state.current,
                current: window.location.href,
            };
        }
        return state;
    }
    default:
        return state;
    }
};

export default problems;
