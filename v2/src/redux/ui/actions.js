export const setDropdownId = dropdownId => ({
    type: 'SET_DROPDOWN_ID',
    payload: {
        dropdownId,
    },
});

export const setTtsPlaying = ttsId => ({
    type: 'SET_TTS_PLAYING',
    payload: {
        ttsId,
    },
});

export const stopTtsPlaying = ttsId => ({
    type: 'STOP_TTS',
    payload: {
        ttsId,
    },
});

export const updateSideBarCollapsed = state => ({
    type: 'UPDATE_SIDEBAR_COLLAPSED',
    payload: {
        sideBarCollapsed: state,
    },
});

export const setCurrentHeight = currentHeight => ({
    type: 'SET_CURRENT_HEIGHT',
    payload: {
        currentHeight,
    },
});

export default {
    setDropdownId,
    setTtsPlaying,
    stopTtsPlaying,
    updateSideBarCollapsed,
    setCurrentHeight,
};
