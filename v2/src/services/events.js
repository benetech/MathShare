import { commonElementFinder, sleep } from './misc';

export const stopEvent = (e) => {
    if (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
    }
    return false;
};

export const passEventForKeys = (callback, keys = [' '], mockClick = true) => (e) => {
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
    if (document.activeElement && document.activeElement.getAttribute('data-trap-focus')) {
        return;
    }
    const startTime = new Date().getTime();
    while (document.readyState !== 'ready' && document.readyState !== 'complete' && (new Date().getTime() - startTime) < 2000) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(100);
    }
    const selector = ['button', '[href]', 'input', 'select', 'textarea', 'h1[tabindex]', 'div[tabindex]']
        .map(current => `#mainContainer ${current}`).join(', ');
    await commonElementFinder.tryToFind(selector, false, true, 4000);
};

export default {
    stopEvent,
};
