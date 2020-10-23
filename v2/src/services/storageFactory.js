const storageFactory = (getStorage) => {
    let inMemoryStorage = {};

    function isSupported() {
        try {
            const testKey = '__some_random_key_you_are_not_going_to_use__';
            getStorage().setItem(testKey, testKey);
            getStorage().removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    function clear() {
        if (isSupported()) {
            getStorage().clear();
        } else {
            inMemoryStorage = {};
        }
    }

    function getItem(name) {
        if (isSupported()) {
            return getStorage().getItem(name);
        }
        // eslint-disable-next-line no-prototype-builtins
        if (inMemoryStorage.hasOwnProperty(name)) {
            return inMemoryStorage[name];
        }
        return null;
    }

    function key(index) {
        if (isSupported()) {
            return getStorage().key(index);
        }
        return Object.keys(inMemoryStorage)[index] || null;
    }

    function removeItem(name) {
        if (isSupported()) {
            getStorage().removeItem(name);
        } else {
            delete inMemoryStorage[name];
        }
    }

    function setItem(name, value) {
        if (isSupported()) {
            getStorage().setItem(name, value);
        } else {
            inMemoryStorage[name] = value; // not everyone uses TypeScript
        }
    }

    function length() {
        if (isSupported()) {
            return getStorage().length;
        }
        return Object.keys(inMemoryStorage).length;
    }

    return {
        getItem,
        setItem,
        removeItem,
        clear,
        key,
        length,
    };
};

export default storageFactory;
