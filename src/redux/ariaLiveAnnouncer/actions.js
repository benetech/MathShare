export const announceOnAriaLive = (message, mode) => ({
    type: 'UPDATE_ARIA_MESSAGE',
    payload: {
        message,
        mode: mode || 'polite',
    },
});

export const clearAriaLive = () => ({
    type: 'CLEAR_ARIA_LIVE',
});

export default {
    announceOnAriaLive,
    clearAriaLive,
};
