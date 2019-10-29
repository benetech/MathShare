export const setTitle = title => ({
    type: 'SET_TITLE',
    payload: {
        title,
    },
});

export const changeTitle = title => ({
    type: 'CHANGE_TITLE',
    payload: {
        title,
    },
});

export default {
    changeTitle,
    setTitle,
};
