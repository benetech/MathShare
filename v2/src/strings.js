import LocalizedStrings from 'react-localization';

class Locales {
    constructor() {
        this.strings = new LocalizedStrings({
            en: {
                benefits_of_logging_in: 'Benefits of logging in',
                benefits_of_signing_up: 'Benefits of signing up',
                continue_without_signing_in: 'Continue to Mathshare without logging in',
                continue_without_signing_up: 'Continue to Mathshare without signing up',
                google: 'Google',
                login_using: 'Log in using',
                mathshare_benetech: 'Benetech Mathshare',
                ms: 'Microsoft',
                sign_in: 'Log in',
                sign_out: 'Sign Out',
                sign_up: 'Sign up',
                sign_up_using: 'Sign up using',
            },
            es: {},
        });
    }
}

export default (new Locales());
