export const stopEvent = (e) => {
    e.stopPropagation();
    e.preventDefault();
    return false;
};

export const passEventForKeys = (callback, keys = ['Enter', ' ']) => (e) => {
    if (keys.includes(e.key)) {
        return callback(e);
    }
    return false;
};

export const focusOnMainContent = () => {
    const main = document.getElementById('mainContainer');
    if (main) {
        const focusable = main.querySelectorAll('button, [href], input, select, textarea, h1[tabindex]');
        const firstFocusable = focusable[0];
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
};

export default {
    stopEvent,
};
