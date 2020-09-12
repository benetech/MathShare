import LocalizedStrings from 'react-localization';

class Locales {
    constructor() {
        this.strings = new LocalizedStrings({
            en: {},
            es: {},
        });
    }
}

export default (new Locales());
