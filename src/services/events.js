import { commonElementFinder } from './misc';

export const stopEvent = (e) => {
    e.stopPropagation();
    e.preventDefault();
    return false;
};

export const passEventForKeys = (callback, keys = ['Enter', ' '], mockClick = true) => (e) => {
    if (keys.includes(e.key)) {
        if (mockClick && ((e.target.tagName === 'A' && e.key === ' ') || (e.target.tagName === 'BUTTON'))) {
            e.target.click();
        } else {
            return callback(e);
        }
    }
    return false;
};

export const focusOnMainContent = async () => {
    const main = await commonElementFinder.tryToFind('#mainContainer', false, false, 1000);
    if (main) {
        const focusable = main.querySelectorAll('button, [href], input, select, textarea, h1[tabindex], div[tabindex');
        const firstFocusable = focusable[0];
        if (document.activeElement && document.activeElement.getAttribute('data-trap-focus')) {
            return;
        }
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
};

export default {
    stopEvent,
};
