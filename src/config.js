let serverUrl;

const hostname = window && window.location && window.location.hostname;
console.log("found hostname" + hostname);

switch (hostname) {
    case 'mathshare-qa.diagramcenter.org':
        serverUrl = 'https://mathshare-api-qa.diagramcenter.org'
        break;
    case 'mathshare-staging.diagramcenter.org':
        serverUrl = 'https://mathshare-api-staging.diagramcenter.org'
        break;
    default:
        serverUrl = 'http://localhost:8080'
}
console.log("using backend SERVER_URL " + serverUrl)

export const SERVER_URL = serverUrl;
