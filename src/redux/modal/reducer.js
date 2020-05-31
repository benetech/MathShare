export const initialState = {
    activeModals: [],
    link: null,
};

const modal = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case 'TOGGLE_MODALS':
        return {
            ...state,
            link: payload.link,
        };
    case 'UPDATE_ACTIVE_MODALS':
        return {
            link: state.link,
            ...payload,
        };
    default:
        return state;
    }
};

export default modal;
