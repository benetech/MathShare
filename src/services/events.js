export const stopEvent = (e) => {
    e.stopPropagation();
    e.preventDefault();
    return false;
};

export default {
    stopEvent,
};
