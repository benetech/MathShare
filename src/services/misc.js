import { findElementByXPath } from './dom';

export const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

export class ElementFinder {
    constructor() {
        this.ongoingId = null;
        this.currentSelector = null;
    }

    tryToFind = async (
        selector, isXPath, focus = true, cutoff = null,
        elementId = null, sleepMs = 50, trial = 1, maxTrials = 10,
    ) => {
        if (trial === 1 && document.activeElement) {
            this.startTime = (new Date()).getTime();
            this.ongoingId = Date.now();
            this.currentSelector = selector;
            this.isXPath = isXPath;
            this.focus = focus;
            this.cutoff = cutoff;
//             if (this.focus) {
//                 document.activeElement.blur();
//             }
            await sleep(sleepMs);
        } else if (elementId !== this.ongoingId || selector !== this.currentSelector) {
            return false;
        }
        await sleep(sleepMs);
        if (trial > maxTrials || (this.isPastCutoff())) {
            return false;
        }
        let element = null;
        if (this.isXPath) {
            element = findElementByXPath(selector);
        } else {
            element = document.querySelector(selector);
        }
        if (element) {
            if (!this.focus) {
                return element;
            }
            element.focus();
        }

        if (document.activeElement !== element) {
            return this.tryToFind(selector, isXPath, focus, cutoff, elementId || this.ongoingId,
                sleepMs + 25, trial + 1, maxTrials);
        }
        return true;
    };

    isPastCutoff = () => (
        this.cutoff && this.cutoff < ((new Date().getTime() - this.startTime))
    );
}

export const commonElementFinder = new ElementFinder();

export default {
    sleep,
    commonElementFinder,
    ElementFinder,
};
