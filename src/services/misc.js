export const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

export class FocusHandler {
    constructor() {
        this.ongoingId = null;
        this.currentSelector = null;
    }

    tryToFocus = async (selector, sleepMs = 50, trial = 1, maxTrials = 10, focusId = null) => {
        if (trial === 1 && document.activeElement) {
            this.ongoingId = Date.now();
            this.currentSelector = selector;
            document.activeElement.blur();
            await sleep(maxTrials * sleepMs * 0.25);
        } else if (focusId !== this.ongoingId || selector !== this.currentSelector) {
            return false;
        }
        await sleep(sleepMs);
        if (trial > maxTrials) {
            return true;
        }
        const element = document.querySelector(selector);
        if (element) {
            element.focus();
        }

        return document.activeElement !== element
            && this.tryToFocus(selector, sleepMs + 50, trial + 1, maxTrials, focusId
                || this.ongoingId);
    };
}

export const commonFocusHandler = new FocusHandler();

export default {
    sleep,
    commonFocusHandler,
    FocusHandler,
};
