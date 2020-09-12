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

export const storeXPathToAnchor = (path, href) => ({
    type: 'STORE_X_PATH',
    payload: {
        path,
        href,
    },
});

export default {
    changeTitle,
    setTitle,
    storeXPathToAnchor,
};
