export const initializePollyClient = () => {
    if (!window.pollyClient
        || !window.pollyClient.getSynthesizeSpeechUrl
        || window.pollyClient.config.credentials.expired) {
        window.pollyClient = new window.AWS.Polly({ apiVersion: '2016-06-10' });
    }
};

export default {
    initializePollyClient,
};
