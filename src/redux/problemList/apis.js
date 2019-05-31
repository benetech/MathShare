import axios from 'axios';

import {
    SERVER_URL,
} from '../../config';

export const fetchDefaultRevisionApi = () => axios.get(`${SERVER_URL}/problemSet/defaultRevision`);

export const fetchProblemsByRevisionCodeApi = revisionCode => axios.get(`${SERVER_URL}/problemSet/revision/${revisionCode}`);

export const fetchProblemsByReviewCodeApi = reviewCode => axios.get(`${SERVER_URL}/solution/review/${reviewCode}`);

export const fetchProblemsByActionAndCodeApi = (action, code) => {
    if (action === 'view') {
        return fetchProblemsByRevisionCodeApi(code);
    }
    // action === 'review'
    return fetchProblemsByReviewCodeApi(code);
};

export const updateProblemsApi = (editCode, shareCode, problems) => axios.put(`${SERVER_URL}/problemSet/${editCode}`, {
    editCode,
    problems,
    shareCode,
});

export const saveProblemSetApi = set => axios.post(`${SERVER_URL}/problemSet/`, set);

export default {
    fetchDefaultRevisionApi,
    fetchProblemsByActionAndCodeApi,
    fetchProblemsByRevisionCodeApi,
    fetchProblemsByReviewCodeApi,
    updateProblemsApi,
    saveProblemSetApi,
};
