export const updateActiveModals = activeModals => ({
    type: 'UPDATE_ACTIVE_MODALS',
    payload: {
        activeModals,
    },
});

export default {
    updateActiveModals,
};
