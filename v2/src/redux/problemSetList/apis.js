import axios from 'axios';

import {
    SERVER_URL,
} from '../../config';

import {
    commonRequestConfig,
} from '../../constants/requestConfig';

export const fetchExampleSetsApi = () => axios.get(`${SERVER_URL}/problemSet/exampleSets`, commonRequestConfig);

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

export const saveProblemSetApi = set => axios.post(`${SERVER_URL}/problemSet/`, set, commonRequestConfig);

export const archiveProblemSetApi = (editCode, archiveMode) => axios.put(`${SERVER_URL}/problemSet/${editCode}/archive`, { archiveMode }, commonRequestConfig);

export default {
    archiveProblemSetApi,
    fetchExampleSetsApi,
    fetchRecentProblemsApi,
    fetchRecentSolutionsApi,
    fetchRecentWorkApi,
    saveProblemSetApi,
};
