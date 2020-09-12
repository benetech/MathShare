import {
    all,
    call,
    fork,
    // getContext,
    // put,
    // select,
    takeEvery,
    takeLatest,
    put,
    select,
} from 'redux-saga/effects';
import CanvasApi from 'caccl-api';

import { fetchAuthorizedConsumersApi } from './apis';
import {
    alertSuccess,
    alertError,
} from '../../scripts/alert';
import Locales from '../../strings';
import { getState } from './selectors';
import { getState as getUserProfileState } from '../userProfile/selectors';
import { getClientToken } from '../../services/lti';

// import { sleep } from '../../services/misc';

function* ltiTestSaga() {
    yield takeEvery('LTI_TEST', function* workerSaga({
        payload: {
            userId,
        },
    }) {
        try {
            const ltiResponse = yield call(fetchAuthorizedConsumersApi);
            const authorizedClients = ltiResponse.data;
            yield put({
                type: 'STORE_CLIENTS',
                payload: {
                    authorizedClients,
                },
            });
            if (authorizedClients.length !== 1) {
                return;
            }
            const authorizedClientId = authorizedClients[0].client_id;
            yield put({
                type: 'SELECT_AUTHORIZED_CLIENT_ID',
                payload: {
                    authorizedClientId,
                },
            });
            const response = yield call(getClientToken, authorizedClientId, userId);
            console.log('response', response);
            const accessToken = response.access_token;
            console.log('accessToken', accessToken);
            const canvasApi = new CanvasApi({
                accessToken,
                canvasHost: 'localhost:3001',
                basePath: 'http://localhost:3001',
            });
            const courses = yield call(canvasApi.user.self.listCourses);
            // const assignments = yield call(canvasApi.course.assignment.list, {
            //     courseId: courseIdDefault,
            // });
            console.log('courses', courses);
            yield put({
                type: 'STORE_COURSES',
                payload: {
                    courses,
                },
            });
            if (courses.length !== 1) {
                return;
            }
            const courseId = courses[0].id;
            yield put({
                type: 'SELECT_COURSE',
                payload: {
                    courseId,
                },
            });
            const assignments = yield call(canvasApi.course.assignment.list, {
                courseId,
            });
            console.log('assignments', assignments);
            yield put({
                type: 'STORE_ASSIGNMENTS',
                payload: {
                    assignments,
                },
            });
        } catch (error) {
            console.log('error', error);
        }
    });
}

function* requestCreateAssignmentOnCanvas() {
    yield takeLatest('CREATE_ASSIGNMENT_ON_CANVAS', function* workerSaga({
        payload: {
            assignmentName, submissionTypes, description, courseId, clientId,
        },
    }) {
        let success = false;
        try {
            const ltiState = yield select(getState);
            const { id } = yield select(getUserProfileState);
            const response = yield call(getClientToken, clientId || ltiState.clientId, id);
            console.log('response', response);
            const accessToken = response.access_token;
            console.log('accessToken', accessToken);
            const canvasApi = new CanvasApi({
                accessToken,
                canvasHost: 'localhost:3001',
                basePath: 'http://localhost:3001',
                // cacheType: config.cacheType,
                // cache: config.cache,
                // sendRequest: config.sendRequest,
                // numRetries: config.numRetries,
                // itemsPerPage: config.itemsPerPage,
            });
            const assignment = yield call(canvasApi.course.assignment.create, {
                name: assignmentName,
                courseId: courseId || ltiState.selectedCourse,
                submissionTypes,
                description,
                published: true,
            });
            console.log('assignment', assignment);
            success = assignment.id > 0;
            alertSuccess('Assignment Created', Locales.strings.success, undefined, { text: 'Link', link: assignment.html_url });
        } catch (error) {
            success = false;
        }
        if (!success) {
            alertError(Locales.strings.submit_to_partner_failure, Locales.strings.failure);
        }
    });
}

function* requestSubmitAssignmentOnCanvas() {
    yield takeLatest('SUBMIT_ASSIGNMENT_ON_CANVAS', function* workerSaga({
        payload: {
            courseId, assignmentId, url, clientId,
        },
    }) {
        const ltiState = yield select(getState);
        let success = false;
        try {
            const { id } = yield select(getUserProfileState);
            const response = yield call(getClientToken, clientId || ltiState.clientId, id);
            console.log('response', response);
            const accessToken = response.access_token;
            console.log('accessToken', accessToken);
            const canvasApi = new CanvasApi({
                accessToken,
                canvasHost: 'localhost:3001',
                basePath: 'http://localhost:3001',
            });
            const submission = yield call(canvasApi.course.assignment.createURLSubmission, {
                assignmentId, courseId, url,
            });
            console.log('assignment', submission);
            success = submission.id > 0;
            alertSuccess('Assignment Submitted', Locales.strings.success, undefined, { text: 'Submission Link', link: submission.preview_url });
        } catch (error) {
            success = false;
        }
        if (!success) {
            alertError(Locales.strings.submit_to_partner_failure, Locales.strings.failure);
        }
    });
}

export default function* rootSaga() {
    yield all([
        fork(ltiTestSaga),
        fork(requestCreateAssignmentOnCanvas),
        fork(requestSubmitAssignmentOnCanvas),
    ]);
}
