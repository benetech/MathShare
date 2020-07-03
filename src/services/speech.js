const mathLive = process.env.MATHLIVE_DEBUG_MODE ? require('../../../mathlive/src/mathlive.js').default
    : require('../lib/mathlivedist/mathlive.js');

export const latexToSpeakableText = latex => mathLive.latexToSpeakableText(
    latex.replace(/updiagonalstrike downdiagonalstrike/g, 'updiagonalstrike'),
    {
        textToSpeechRules: 'sre',
        textToSpeechRulesOptions: { domain: 'mathspeak', style: 'default', markup: 'none' },
        // textToSpeechRules: 'sre',
        // textToSpeechRulesOptions: { domain: 'clearspeak', style: 'default', markup: 'none' },
    },
);

export default {
    latexToSpeakableText,
};
