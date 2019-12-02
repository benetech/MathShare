import {
    LOCATION_CHANGE,
} from 'connected-react-router';

const initialState = {
    dropdownOpen: null,
};

const ui = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case LOCATION_CHANGE:
        return initialState;
    case 'SET_DROPDOWN_ID':
        return {
            ...state,
            dropdownOpen: payload.dropdownId,
        };
    default:
        return state;
    }
};

export default ui;
