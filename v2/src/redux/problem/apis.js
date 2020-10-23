import axios from 'axios';

import {
    SERVER_URL,
} from '../../config';

import {
    commonRequestConfig,
} from '../../constants/requestConfig';

export const fetchProblemSolutionReadonlyAPi = code => axios.get(`${SERVER_URL}/solution/revision/${code}`, commonRequestConfig);

export const fetchProblemSolutionEditAPi = code => axios.get(`${SERVER_URL}/solution/${code}`, commonRequestConfig);

export const fetchProblemSolutionApi = (action, code) => {
    if (action === 'view') {
        return fetchProblemSolutionReadonlyAPi(code);
    }
    return fetchProblemSolutionEditAPi(code);
};

export const updateProblemSolutionApi = (editCode, solution) => axios.put(`${SERVER_URL}/solution/${editCode}`, solution, commonRequestConfig);

export const updateProblemSolutionSetApi = (editCode, solutions) => axios.put(`${SERVER_URL}/solution/solve/${editCode}`, solutions, commonRequestConfig);

export default {
    fetchProblemSolutionApi,
    updateProblemSolutionApi,
};
