export const initialState = {
    activeModals: [],
};

const modal = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case 'UPDATE_ACTIVE_MODALS':
        return payload;
    default:
        return state;
    }
};

export default modal;
