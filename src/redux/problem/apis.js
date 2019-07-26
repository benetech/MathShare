import axios from 'axios';

import {
    SERVER_URL,
} from '../../config';

export const fetchProblemSolutionReadonlyAPi = code => axios.get(`${SERVER_URL}/solution/revision/${code}`);

export const fetchProblemSolutionEditAPi = code => axios.get(`${SERVER_URL}/solution/${code}`);

export const fetchProblemSolutionApi = (action, code) => {
    if (action === 'view') {
        return fetchProblemSolutionReadonlyAPi(code);
    }
    return fetchProblemSolutionEditAPi(code);
};

export const updateProblemSolutionApi = (editCode, solution) => axios.put(`${SERVER_URL}/solution/${editCode}`, solution);

export const updateProblemSolutionSetApi = (editCode, solutions) => axios.put(`${SERVER_URL}/solution/solve/${editCode}`, solutions);

export default {
    fetchProblemSolutionApi,
    updateProblemSolutionApi,
};
