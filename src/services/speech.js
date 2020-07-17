const mathLive = process.env.MATHLIVE_DEBUG_MODE ? require('../../../mathlive/src/mathlive.js').default
    : require('../lib/mathlivedist/mathlive.js');

export const latexToSpeakableText = (latex) => {
    let result = mathLive.latexToSpeakableText(
        latex.replace(/updiagonalstrike downdiagonalstrike/g, 'updiagonalstrike'),
        {
            textToSpeechRules: 'mathlive',
            textToSpeechRulesOptions: { domain: 'clearspeak', style: 'default', markup: 'none' },
        },
    );
    if (result) {
        result = result.replace(/End cross out/g, 'End cross out. ');
    }
    return result;
};


export default {
    latexToSpeakableText,
};
