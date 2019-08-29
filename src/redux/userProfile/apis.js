import axios from 'axios';

import {
    SERVER_URL,
} from '../../config';

export const fetchUserInfoApi = email => axios.post(`${SERVER_URL}/userInfo/fetch`, {
    email,
});

export const saveUserInfoApi = userInfo => axios.post(`${SERVER_URL}/userInfo/submit`, userInfo);

export default {
    fetchUserInfoApi,
    saveUserInfoApi,
};
