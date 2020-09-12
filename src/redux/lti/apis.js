import axios from 'axios';

import {
    API_URL,
} from '../../config';

import {
    commonRequestConfig,
} from '../../constants/requestConfig';

const apiPrefix = 'oauth2/lti';

export const fetchAuthorizedConsumersApi = () => axios.get(`${API_URL}/${apiPrefix}/consumers/authorized`, commonRequestConfig);

export const fetchAvailableConsumersApi = () => axios.get(`${API_URL}/${apiPrefix}/consumers/available`, commonRequestConfig);

export const fetchLTIAccessTokenApi = clientId => axios.post(`${API_URL}/${apiPrefix}/access`, { clientId }, commonRequestConfig);

export default {
    fetchAuthorizedConsumersApi,
    fetchAvailableConsumersApi,
    fetchLTIAccessTokenApi,
};
