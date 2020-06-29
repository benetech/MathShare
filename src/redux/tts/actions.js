export const dismountTtsButton = ttsBtnId => ({
    type: 'DISMOUNT_TTS_BUTTON',
    payload: {
        ttsBtnId,
    },
});

export const loadTtsAudio = (ttsBtnId, text) => ({
    type: 'LOAD_TTS_AUDIO',
    payload: {
        ttsBtnId,
        text,
    },
});

export const startTts = (ttsBtnId, text, isRetrial) => ({
    type: 'START_TTS',
    payload: {
        ttsBtnId,
        text,
        isRetrial,
    },
});

export const stopTtsAudio = ttsBtnId => ({
    type: 'STOP_TTS_AUDIO',
    payload: {
        ttsBtnId,
    },
});

export default {
    dismountTtsButton,
    loadTtsAudio,
    startTts,
    stopTtsAudio,
};
