const msal = {
    auth: {
        clientId: process.env.MSAL_CLIENT_ID,
        authority: 'https://login.microsoftonline.com/organizations',
        postLogoutRedirectUri: () => window.location.href,
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true,
    },
};

export default msal;
