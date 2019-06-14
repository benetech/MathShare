import ReactGA from 'react-ga';
import {
    LOCATION_CHANGE,
} from 'connected-react-router';


const problems = (state = {}, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case LOCATION_CHANGE:
        ReactGA.pageview(
            payload.location.pathname,
        );
        return state;
    default:
        return state;
    }
};

export default problems;
