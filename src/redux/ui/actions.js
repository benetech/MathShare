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

export default {
    setDropdownId,
    setTtsPlaying,
    stopTtsPlaying,
};
