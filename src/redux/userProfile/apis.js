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

export const getConfigApi = () => axios.get(`${API_URL}/config`, commonRequestConfig);

export const setConfigApi = config => axios.post(`${API_URL}/config`, config, commonRequestConfig);

export const fetchUserInfoApi = () => axios.get(`${SERVER_URL}/userInfo/fetch`, commonRequestConfig);

export const saveUserInfoApi = userInfo => axios.post(`${SERVER_URL}/userInfo/submit`, userInfo, commonRequestConfig);

export const updateNotifyMobileApi = notifyForMobile => axios.put(`${SERVER_URL}/userInfo/notifyForMobile`, {
    notifyForMobile,
}, commonRequestConfig);

export const fetchRecentProblemsApi = headers => axios.get(`${SERVER_URL}/private/recent`, {
    ...commonRequestConfig,
    headers,
});

export const fetchRecentSolutionsApi = headers => axios.get(`${SERVER_URL}/private/recentSolutions`, {
    ...commonRequestConfig,
    headers,
});

export const fetchRecentWorkApi = (role) => {
    if (!role || role === 'student') {
        return fetchRecentSolutionsApi;
    }
    return fetchRecentProblemsApi;
};

export default {
    fetchCurrentUserApi,
    fetchRecentSolutionsApi,
    fetchRecentWorkApi,
    fetchUserInfoApi,
    getConfigApi,
    logoutApi,
    saveUserInfoApi,
    setConfigApi,
    updateNotifyMobileApi,
};
