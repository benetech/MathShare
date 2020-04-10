import { findElementByXPath } from './dom';

export const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

export class ElementFinder {
    constructor() {
        this.ongoingId = null;
        this.currentSelector = null;
        this.initialSleepTime = 0;
    }

    tryToFind = async (
        selector, isXPath, focus = true, cutoff = null,
        elementId = null, sleepMs = 50, trial = 1, maxTrials = 25,
    ) => {
        if (trial === 1 && document.activeElement) {
            this.startTime = (new Date()).getTime();
            this.ongoingId = Date.now();
            this.currentSelector = selector;
            this.isXPath = isXPath;
            this.focus = focus;
            this.cutoff = cutoff;
            this.initialSleepTime = sleepMs;
            this.maxTrials = maxTrials;
            if (this.focus) {
                document.activeElement.blur();
            }
            await sleep(this.initialSleepTime);
        } else if (elementId !== this.ongoingId || selector !== this.currentSelector) {
            return false;
        } else {
            await sleep(sleepMs);
        }
        if (trial > this.maxTrials || (this.isPastCutoff())) {
            return false;
        }
        const element = this.findElement(selector);
        if (element) {
            if (!this.focus) {
                return element;
            }
            element.focus();
        }

        if (document.activeElement !== element) {
            const result = await this.tryToFind(selector, isXPath, focus, cutoff,
                elementId || this.ongoingId,
                Math.min(this.initialSleepTime * 5, sleepMs + 25),
                trial + 1, this.maxTrials);
            return result;
        }
        // const result = await this.verifyIfFocusStays();
        // return result;
        return true;
    };

    isPastCutoff = () => (
        this.cutoff && this.cutoff < ((new Date().getTime() - this.startTime))
    );

    findElement = () => {
        let element = null;
        if (this.isXPath) {
            element = findElementByXPath(this.currentSelector);
        } else if (this.currentSelector.indexOf(', ') > -1) {
            const elements = document.querySelectorAll(this.currentSelector);
            if (elements.length > 0) {
                element = elements[0];
            }
        } else {
            element = document.querySelector(this.currentSelector);
        }
        return element;
    };

    verifyIfFocusStays = async () => {
        await sleep(500);
        const element = this.findElement(this.currentSelector);
        if (element && document.activeElement !== element) {
            const result = await this.tryToFind(this.currentSelector, this.isXPath, this.focus,
                this.cutoff, this.ongoingId, this.initialSleepTime, 1, this.maxTrials);
            return result;
        }
        return true;
    }
}

export const commonElementFinder = new ElementFinder();

export default {
    sleep,
    commonElementFinder,
    ElementFinder,
};
