import { initializePollyClient } from '../../services/aws';

export const generateTtsUrl = (speechParams) => {
    initializePollyClient();
    return new Promise((resolve, reject) => {
        new window.AWS.Polly.Presigner(speechParams, window.pollyClient)
            .getSynthesizeSpeechUrl(speechParams, (error, url) => {
                if (!error) {
                    resolve(url);
                } else {
                    reject(error);
                }
            });
    });
};

export default {
    generateTtsUrl,
};
