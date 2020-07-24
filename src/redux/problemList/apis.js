import axios from 'axios';

import {
    SERVER_URL,
    API_URL,
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

export const updateProblemsApi = payload => axios.put(`${SERVER_URL}/problemSet/${payload.editCode}`, payload, commonRequestConfig);

export const saveProblemSetApi = set => axios.post(`${SERVER_URL}/problemSet/`, set, commonRequestConfig);

export const updateProblemStepsInSet = (editCode, payload) => axios.put(`${SERVER_URL}/problemSet/${editCode}/problem/`, payload, commonRequestConfig);

export const archiveProblemSetApi = (editCode, archiveMode) => axios.put(`${SERVER_URL}/problemSet/${editCode}/archive`, { archiveMode }, commonRequestConfig);

export const fetchEditableProblemSetSolutionApi = editCode => axios.get(`${SERVER_URL}/solution/solve/${editCode}`, commonRequestConfig);

export const fetchPartnerSubmitOptionsApi = partnerCode => axios.post(`${API_URL}/partner/submitOptions`, { partnerCode }, commonRequestConfig);

export const submitToPartnerApi = (id, editCode, shareCode) => axios.post(`${API_URL}/partner/submit`, { id, editCode, shareCode }, commonRequestConfig);

export default {
    archiveProblemSetApi,
    fetchDefaultRevisionApi,
    fetchProblemsByActionAndCodeApi,
    fetchProblemsByRevisionCodeApi,
    fetchProblemsByReviewCodeApi,
    updateProblemsApi,
    updateProblemStepsInSet,
    saveProblemSetApi,
    fetchEditableProblemSetSolutionApi,
    fetchPartnerSubmitOptionsApi,
    submitToPartnerApi,
};
