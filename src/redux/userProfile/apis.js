import axios from 'axios';

import {
    SERVER_URL,
    API_URL,
} from '../../config';

import {
    commonRequestConfig,
} from '../../constants/requestConfig';

export const fetchCurrentUserApi = () => axios.get(`${API_URL}/user`, commonRequestConfig);

export const logoutApi = () => axios.get(`${API_URL}/logout`, commonRequestConfig);

export const fetchUserInfoApi = email => axios.post(`${SERVER_URL}/userInfo/fetch`, {
    email,
}, commonRequestConfig);

export const saveUserInfoApi = userInfo => axios.post(`${SERVER_URL}/userInfo/submit`, userInfo, commonRequestConfig);

export const fetchRecentWorkApi = () => axios.get(`${SERVER_URL}/private/recent`, commonRequestConfig);

export default {
    fetchCurrentUserApi,
    fetchRecentWorkApi,
    fetchUserInfoApi,
    logoutApi,
    saveUserInfoApi,
};
