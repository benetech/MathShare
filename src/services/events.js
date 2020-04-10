import { commonElementFinder, sleep } from './misc';

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
    const startTime = new Date().getTime();
    while (document.readyState !== 'ready' && document.readyState !== 'complete' && (new Date().getTime() - startTime) < 2000) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(100);
    }
    const main = await commonElementFinder.tryToFind('#mainContainer', false, false, 2000);
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
