import axios from 'axios';

import {
    API_URL,
} from '../../config';

export const fetchCurrentUserApi = () => axios.get(`${API_URL}/user`, {
    withCredentials: true,
});

export const logoutApi = () => axios.get(`${API_URL}/logout`, {
    withCredentials: true,
});

export default {
    fetchCurrentUserApi,
    logoutApi,
};
