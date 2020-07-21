import { sleep } from './misc';

export const waitForIntercomToBoot = async (maxRetries = 5) => {
    let intercomRetriesLeft = maxRetries;
    while (!window.Intercom || !window.Intercom.booted) {
        if (intercomRetriesLeft === -1) {
            return false;
        }
        // eslint-disable-next-line no-await-in-loop
        await sleep(1000);
        intercomRetriesLeft -= 1;
    }
    return true;
};

export default {
    waitForIntercomToBoot,
};
