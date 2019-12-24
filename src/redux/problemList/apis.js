import axios from 'axios';

import {
    SERVER_URL,
} from '../../config';

import {
    commonRequestConfig,
} from '../../constants/requestConfig';

export const fetchDefaultRevisionApi = () => axios.get(`${SERVER_URL}/problemSet/defaultRevision`, commonRequestConfig);

export const fetchExampleSetsApi = () => axios.get(`${SERVER_URL}/problemSet/exampleSets`, commonRequestConfig);

export const fetchProblemsByRevisionCodeApi = revisionCode => axios.get(`${SERVER_URL}/problemSet/revision/${revisionCode}`, commonRequestConfig);

export const fetchProblemsByEditCodeApi = editCode => axios.get(`${SERVER_URL}/problemSet/${editCode}`, commonRequestConfig);

export const fetchProblemsByReviewCodeApi = reviewCode => axios.get(`${SERVER_URL}/solution/review/${reviewCode}`, commonRequestConfig);

export const fetchProblemsByActionAndCodeApi = (action, code) => {
    if (action === 'view') {
        return fetchProblemsByRevisionCodeApi(code);
    }

    if (action === 'edit') {
        return fetchProblemsByEditCodeApi(code);
    }
    // action === 'review'
    return fetchProblemsByReviewCodeApi(code);
};

export const updateProblemsApi = (editCode, shareCode, problems, title) => axios.put(`${SERVER_URL}/problemSet/${editCode}`, {
    editCode,
    problems,
    shareCode,
    title,
}, commonRequestConfig);

export const saveProblemSetApi = set => axios.post(`${SERVER_URL}/problemSet/`, set, commonRequestConfig);

export const updateProblemStepsInSet = (editCode, problemId, steps) => axios.put(`${SERVER_URL}/problemSet/${editCode}/steps/${problemId}`, steps, commonRequestConfig);

export const fetchEditableProblemSetSolutionApi = editCode => axios.get(`${SERVER_URL}/solution/solve/${editCode}`, commonRequestConfig);

export default {
    fetchDefaultRevisionApi,
    fetchProblemsByActionAndCodeApi,
    fetchProblemsByRevisionCodeApi,
    fetchProblemsByReviewCodeApi,
    updateProblemsApi,
    updateProblemStepsInSet,
    saveProblemSetApi,
    fetchEditableProblemSetSolutionApi,
};
