const initialState = {
    dropdownOpen: null,
    ttsId: null,
    sideBarCollapsed: null,
    initialHeight: null,
    currentHeight: null,
    focused: {
        id: null,
        className: null,
        tag: null,
        attributes: {},
    },
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
    case 'UPDATE_SIDEBAR_COLLAPSED': {
        return {
            ...state,
            ...payload,
        };
    }
    case 'SET_CURRENT_HEIGHT': {
        const { currentHeight } = payload;
        let initialHeight = state.initialHeight;
        if (initialHeight === null) {
            initialHeight = currentHeight;
        }
        return {
            ...state,
            initialHeight,
            currentHeight,
        };
    }
    case 'SET_CURRENT_FOCUS': {
        return {
            ...state,
            focused: payload,
        };
    }
    case 'BLUR_CURRENT_FOCUSED': {
        return {
            ...state,
            focused: initialState.focused,
        };
    }
    default:
        return state;
    }
};

export default ui;
