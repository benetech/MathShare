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


export default {
    fetchProblemSolutionApi,
};
