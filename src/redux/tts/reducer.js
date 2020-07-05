const initialState = {
    currentTtsId: null,
    currentText: null,
    currentTtsStatus: null,
    ttsStore: {},
};

const tts = (state = initialState, {
    type,
    payload,
}) => {
    switch (type) {
    case 'START_TTS': {
        return {
            ...state,
            currentText: payload.text,
            currentTtsId: payload.ttsBtnId,
            currentTtsStatus: initialState.currentTtsStatus,
        };
    }
    case 'STARTED_PLAYING_TTS': {
        if (state.currentTtsId === payload.ttsBtnId) {
            return {
                ...state,
                currentTtsStatus: true,
            };
        }
        return state;
    }
    case 'STORE_TTS_URL': {
        return {
            ...state,
            ttsStore: {
                ...state.ttsStore,
                [payload.ttsBtnId]: {
                    ...payload,
                    time: (new Date().getTime()),
                },
            },
        };
    }
    case 'STOP_TTS_AUDIO': {
        if (!payload.ttsBtnId || payload.ttsBtnId === state.currentTtsId) {
            return {
                ...state,
                currentTtsId: initialState.currentTtsId,
                currentText: initialState.currentText,
                currentTtsStatus: initialState.currentTtsStatus,
            };
        }
        return state;
    }
    default:
        return state;
    }
};

export default tts;
