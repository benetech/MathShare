import axios from 'axios';

import {
    SERVER_URL,
} from '../../config';

import {
    commonRequestConfig,
} from '../../constants/requestConfig';

export const fetchExampleSetsApi = () => axios.get(`${SERVER_URL}/problemSet/exampleSets`, commonRequestConfig);

export default {
    fetchExampleSetsApi,
};
