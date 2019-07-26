import axios from 'axios';

import {
    SERVER_URL,
} from '../../config';

export const fetchDefaultRevisionApi = () => axios.get(`${SERVER_URL}/problemSet/defaultRevision`);

export const fetchExampleSetsApi = () => axios.get(`${SERVER_URL}/problemSet/exampleSets`);

export const fetchProblemsByRevisionCodeApi = revisionCode => axios.get(`${SERVER_URL}/problemSet/revision/${revisionCode}`);

export const fetchProblemsByEditCodeApi = editCode => axios.get(`${SERVER_URL}/problemSet/${editCode}`);

export const fetchProblemsByReviewCodeApi = reviewCode => axios.get(`${SERVER_URL}/solution/review/${reviewCode}`);

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
});

export const saveProblemSetApi = set => axios.post(`${SERVER_URL}/problemSet/`, set);

export const fetchEditableProblemSetSolutionApi = editCode => axios.get(`${SERVER_URL}/solution/solve/${editCode}`);

export default {
    fetchDefaultRevisionApi,
    fetchProblemsByActionAndCodeApi,
    fetchProblemsByRevisionCodeApi,
    fetchProblemsByReviewCodeApi,
    updateProblemsApi,
    saveProblemSetApi,
    fetchEditableProblemSetSolutionApi,
};
