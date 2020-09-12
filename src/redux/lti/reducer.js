export const initialState = {
    authorizedClients: [],
    authorizedClientId: null,
    assignments: [],
    assignmentsLoading: false,
    courses: [],
    courseId: null,
    coursesLoading: false,
};

const modal = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case 'STORE_CLIENTS': {
        return {
            ...state,
            authorizedClients: payload.authorizedClients,
        };
    }
    case 'SELECT_AUTHORIZED_CLIENT_ID': {
        return {
            ...state,
            authorizedClientId: payload.authorizedClientId,
        };
    }
    case 'STORE_COURSES': {
        return {
            ...state,
            courses: payload.courses,
        };
    }
    case 'SELECT_COURSE': {
        return {
            ...state,
            courseId: payload.courseId,
        };
    }
    case 'STORE_ASSIGNMENTS':
        return {
            ...state,
            assignments: payload.assignments,
        };
    default:
        return state;
    }
};

export default modal;
