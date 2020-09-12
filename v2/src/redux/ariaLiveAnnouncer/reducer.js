const initialState = {
    message: '',
    mode: 'polite',
};

const ariaLiveAnnouncer = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case 'UPDATE_ARIA_MESSAGE':
        return {
            ...state,
            ...payload,
        };
    case 'CLEAR_ARIA_LIVE':
        return initialState;
    default:
        return state;
    }
};

export default ariaLiveAnnouncer;
