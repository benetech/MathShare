/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
const { AxePuppeteer } = require('axe-puppeteer');
const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

// https://github.com/dequelabs/axe-puppeteer

const PORT = 1234;

const routes = [
    '',
    '#/app',
    '#/app/problemSet/solve/SIOIZ7QOFW4DW',
    '#/signIn',
    '#/privacy',
    '#/partners',
];

// https://github.com/typicode/json-server

(async () => {
    const jsonServer = spawn('json-server', ['dummy_api/db.json', '--routes', 'dummy_api/routes.json', '--port', '8080']);

    const jsonServerPromise = new Promise((resolve) => {
        jsonServer.stdout.on('data', async (chunk) => {
            if (jsonServerPromise.isResolved) return;
            const log = chunk.toString('utf8');
            console.log(`Api Server: ${log}`);
            if (log.includes('Type s + enter at any time to create a snapshot of the database')) {
                jsonServerPromise.isResolved = true;
                resolve();
            }
        });
    });

    const webServerProcess = spawn('webpack-dev-server', ['--mode', 'development', '--stage=local', `--port=${PORT}`]);

    const webServerPromise = new Promise((resolve) => {
        webServerProcess.stdout.on('data', async (chunk) => {
            if (webServerPromise.isResolved) return;
            const log = chunk.toString('utf8');
            console.log(`Frontend: ${log}`);
            if (log.indexOf('Compiled with warnings.') > -1) {
                webServerPromise.isResolved = true;
                resolve();
            }
        });
    });

    const validate = async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setBypassCSP(true);

        const violations = {};

        for (let index = 0; index < routes.length; index += 1) {
            const route = routes[index];
            const routeLog = `Route ${route}`;
            console.log(routeLog);
            await page.goto(`http://localhost:${PORT}/${route}`);

            if (route.endsWith('example')) {
                await page.keyboard.press('Escape');
            }
            console.log(`${routeLog}: aXe analysis started`);
            try {
                const results = await new AxePuppeteer(page).analyze();
                if (results.violations.length > 0) {
                    violations[route || '/'] = results.violations;
                }
                console.log(`${routeLog}: aXe analysis complete`);
            } catch (error) {
                console.log(error);
                console.log(`${routeLog}: aXe analysis error`);
            }
        }

        console.log('All routes visited');

        await page.close();
        await browser.close();

        webServerProcess.kill();
        jsonServer.kill();
        if (Object.keys(violations).length === 0) {
            console.log('aXe Audit Passed\n\n');
        } else {
            console.error('aXe Audit Failed');
            console.error('Violations: ', violations);
            process.exit(-1);
        }
    };

    Promise.all([jsonServerPromise, webServerPromise]).then(async () => {
        await validate();
    });
})();
