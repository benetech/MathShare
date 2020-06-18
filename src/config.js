/* eslint-disable  no-console, prefer-template */
const hostname = window && window.location && window.location.hostname;
console.log('found hostname: ' + hostname);
let serverUrl;
let protocol = 'https';
switch (hostname) {
case 'mathshare.benetech.org':
    serverUrl = 'https://mathshare-api.benetech.org';
    break;
case 'mathshare-qa.diagramcenter.org':
    serverUrl = 'https://mathshare-api-qa.diagramcenter.org';
    break;
case 'mathshare-staging.diagramcenter.org':
    serverUrl = 'https://mathshare-api-staging.diagramcenter.org';
    break;
default:
    serverUrl = 'http://localhost:8080';
    protocol = 'http';
}
console.log('using server URL: ' + serverUrl);
export const API_URL = serverUrl;
export const SERVER_URL = `${serverUrl}/api`;
export const FRONTEND_URL = hostname === 'localhost' ? 'localhost:3000/#' : `${hostname}/#`;
export const FRONTEND_URL_PROTO = `${protocol}://${FRONTEND_URL}`;
