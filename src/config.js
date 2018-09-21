/* eslint-disable  no-console, prefer-template */
const hostname = window && window.location && window.location.hostname;
console.log('found hostname: ' + hostname);
let serverUrl;
switch (hostname) {
case 'mathshare-qa.diagramcenter.org':
    serverUrl = 'https://mathshare-api-qa.diagramcenter.org';
    break;
case 'mathshare-staging.diagramcenter.org':
    serverUrl = 'https://mathshare-api-staging.diagramcenter.org';
    break;
default:
    serverUrl = 'http://localhost:8080';
}
console.log('using server URL: ' + serverUrl);
export const SERVER_URL = serverUrl;
export const FRONTEND_URL = hostname === 'localhost' ? 'localhost:3000/#' : `${hostname}/#`;
