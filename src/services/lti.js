import { fetchLTIAccessTokenApi } from '../redux/lti/apis';
import { getWithExpiry, setWithExpiry } from './storage';

export const getClientToken = async (clientId, userId) => {
    const key = `lti:${clientId}:${userId}`;
    const storedValue = getWithExpiry(key);
    if (storedValue) {
        return storedValue;
    }
    const response = await fetchLTIAccessTokenApi(clientId);
    if (response.status !== 200) {
        throw Error(response);
    }
    const tenMinutes = 1000 * 60 * 10;
    setWithExpiry(key, response.data, tenMinutes);
    return response.data;
};

export default {
    getClientToken,
};
