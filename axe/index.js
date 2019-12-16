/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
const { AxePuppeteer } = require('axe-puppeteer');
const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

const PORT = 1234;

const routes = [
    '',
    '#/signIn',
    '#/privacy',
    '#/partners',
];

// https://github.com/typicode/json-server

(async () => {
    const child = spawn('webpack-dev-server', ['--mode', 'development', '--stage=local', `--port=${PORT}`]);

    child.stdout.on('data', async (chunk) => {
        const log = chunk.toString('utf8');
        console.log(log);
        if (log.indexOf('Compiled with warnings.') > -1) {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setBypassCSP(true);

            const violations = {};

            for (let index = 0; index < routes.length; index += 1) {
                const route = routes[index];
                // console.log(`Route: ${route}`);
                await page.goto(`http://localhost:${PORT}/${route}`);

                const results = await new AxePuppeteer(page).analyze();
                if (results.violations.length > 0) {
                    violations[route || '/'] = results.violations;
                }
            }
            await page.close();
            await browser.close();


            child.kill();
            if (Object.keys(violations).length === 0) {
                console.log('aXe Audit Passed\n\n');
            } else {
                console.error('aXe Audit Failed');
                console.error('Violations: ', violations);
                process.exit(-1);
            }
        }
    });
})();
