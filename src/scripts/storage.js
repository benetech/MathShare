import storageFactory from './storageFactory';

export const localStore = storageFactory(() => localStorage);
export const sessionStore = storageFactory(() => sessionStorage);
