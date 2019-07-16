/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const paths = require('./paths');

delete require.cache[require.resolve('./paths')];
// console.log('++++++++++++');
// console.log(JSON.stringify(process.env));
// console.log('++++++++++++');

function getClientEnvironment(envStage) {
    const ENV_STAGE = envStage || 'qa';
    if (!ENV_STAGE) {
        throw new Error(
            'The stage environment variable is required but was not specified.',
        );
    }

    const dotenvFiles = [
        `${paths.dotenv}.${ENV_STAGE}`,
    ].filter(Boolean);

    dotenvFiles.forEach((dotenvFile) => {
        if (fs.existsSync(dotenvFile)) {
            require('dotenv-expand')(
                require('dotenv').config({
                    path: dotenvFile,
                }),
            );
        }
    });

    const appDirectory = fs.realpathSync(process.cwd());
    process.env.ENV_STAGE = (process.env.ENV_STAGE || '')
        .split(path.delimiter)
        .filter(folder => folder && !path.isAbsolute(folder))
        .map(folder => path.resolve(appDirectory, folder))
        .join(path.delimiter);
    console.log(process.env.ENV_STAGE);
    const raw = Object.keys(process.env)
        .reduce(
            (env, key) => ({
                ...env,
                [key]: process.env[key],
            }), {},
        );

    const stringified = Object.keys(raw).reduce((env, key) => ({
        ...env,
        [`process.env.${key}`]: JSON.stringify(raw[key]),
    }), {});

    return {
        raw,
        stringified,
    };
}

module.exports = getClientEnvironment;
