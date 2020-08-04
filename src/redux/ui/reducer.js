const initialState = {
    dropdownOpen: null,
    ttsId: null,
};

const ui = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case 'SET_DROPDOWN_ID':
        return {
            ...state,
            dropdownOpen: payload.dropdownId,
        };
    case 'SET_TTS_PLAYING':
        return {
            ...state,
            ttsId: payload.ttsId,
        };
    case 'STOP_TTS': {
        if (state.ttsId === payload.ttsId) {
            return {
                ...state,
                ttsId: null,
            };
        }
        return state;
    }
    default:
        return state;
    }
};

export default ui;
