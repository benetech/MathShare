import * as dayjs from 'dayjs';

/* eslint-disable no-unused-vars */
const initialState = {
    revisionCode: null,
    defaultRevisionCode: null,
    set: {
        problems: [],
        editCode: null,
        shareCode: null,
        title: '',
        source: null,
        partner: {
            canSubmit: false,
            name: null,
        },
    },
    notFound: false,
    problemToEditIndex: null,
    problemToDeleteIndex: null,
    allowedPalettes: [],
    theActiveMathField: null,
    tempPalettes: [],
    tempSet: {
        problems: [],
        title: '',
        textAreaValue: '',
        displayScratchpad: () => {},
    },
    newSetSharecode: '',
    newSetShareEditCode: '',
    problemSetShareCode: '',
    solutions: [],
};


const addPositionToProblems = (newData, currentData) => {
    const problemList = newData.problems;
    let currentProblemList = [];
    if (newData.editCode === currentData.set.editCode) {
        currentProblemList = currentData.set.problems || [];
        currentProblemList.map((currentProblem, index) => {
            if (index >= problemList.length
                && (problemList.length + 1) === currentProblemList.length) {
                problemList.push(currentProblem);
            }
            return null;
        });
    }
    if (!problemList || problemList.length === 0) {
        return [{
            position: 0,
            text: '',
            title: '',
        }];
    }
    const multipleZeros = problemList.filter(problem => (
        !problem.position || problem.position === 0
    ));
    if (multipleZeros.length === 1) {
        return problemList;
    }
    return problemList.map((problem, position) => ({
        ...problem,
        position,
    }));
};

const problems = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case '@@router/LOCATION_CHANGE': {
        const { location } = payload;
        if (location.pathname === '/app') {
            return initialState;
        }
        return state;
    }
    case 'REQUEST_DEFAULT_REVISION_SUCCESS':
        return {
            ...state,
            defaultRevisionCode: payload.revisionCode,
        };
    case 'CLEAR_PROBLEM_SET':
        return {
            ...state,
            set: initialState.set,
            tempSet: {
                ...initialState.tempSet,
                title: `New Problem Set ${dayjs().format('MM-DD-YYYY')}`,
            },
        };
    case 'RESET_PROBLEM_SET':
    case 'REQUEST_PROBLEM_SET':
        return {
            ...state,
            set: initialState.set,
        };
    case 'REQUEST_PROBLEM_SET_SUCCESS':
    case 'REQUEST_SAVE_PROBLEMS_SUCCESS':
        return {
            ...state,
            set: {
                ...payload,
                problems: addPositionToProblems(payload, state),
            },
            newSetSharecode: payload.shareCode,
        };
    case 'ADD_PROBLEM': {
        const setProblems = state.set.problems;
        const problemToEditIndex = setProblems.length - 1;
        const lastProblem = setProblems[problemToEditIndex];
        if (lastProblem.text === '' && lastProblem.title === '') {
            return {
                ...state,
                problemToEditIndex,
                problemToEdit: {
                    ...lastProblem,
                },
            };
        }
        return {
            ...state,
            problemToEditIndex: problemToEditIndex + 1,
            problemToEdit: payload.problem,
            set: {
                ...state.set,
                problems: [
                    ...state.set.problems,
                    payload.problem,
                ],
            },
        };
    }
    case 'UPDATE_PROBLEM_LIST':
        return {
            ...state,
            set: {
                ...state.set,
                problems: payload.problemList,
            },
        };
    case 'ADD_TEMP_PROBLEM':
        return {
            ...state,
            tempSet: {
                ...state.tempSet,
                problems: [
                    ...state.tempSet.problems,
                    payload.problem,
                ],
            },
        };
    case 'SET_ACTIVE_MATH_FIELD_IN_PROBLEM':
    case 'SET_ACTIVE_MATH_FIELD':
        return {
            ...state,
            theActiveMathField: payload.field,
        };
    case 'SET_PROBLEM_SET_SHARE_CODE':
        return {
            ...state,
            problemSetShareCode: payload.problemSetShareCode,
        };
    case 'REQUEST_SAVE_PROBLEM_SET_SUCCESS':
        return {
            ...state,
            tempSet: {
                ...initialState.tempSet,
                title: `New Problem Set ${dayjs().format('MM-DD-YYYY')}`,
            },
            newSetSharecode: payload.shareCode,
            newSetShareEditCode: payload.editCode,
        };
    case 'RESET_TEMP_PROBLEMS':
        return {
            ...state,
            tempSet: initialState.tempSet,
        };
    case 'UPDATE_TEMP_SET':
        return {
            ...state,
            tempSet: {
                ...state.tempSet,
                ...payload,
            },
        };
    case 'UPDATE_SET':
        return {
            ...state,
            set: {
                ...state.set,
                ...payload,
            },
        };
    case 'SET_PROBLEM_DELETE_INDEX':
        return {
            ...state,
            problemToDeleteIndex: payload.problemToDeleteIndex,
        };
    case 'SET_EDIT_PROBLEM': {
        let set = null;
        if (payload.action === 'new') {
            set = state.tempSet;
        } else {
            set = state.set;
        }
        return {
            ...state,
            problemToEditIndex: payload.problemToEditIndex,
            problemToEdit: {
                ...set.problems[payload.problemToEditIndex],
            },
        };
    }
    case 'UPDATE_EDIT_PROBLEM': {
        const problemToEditIndex = state.problemToEditIndex || 0;
        return {
            ...state,
            set: {
                ...state.set,
                problems: [
                    ...state.set.problems.filter((_, index) => index < problemToEditIndex),
                    {
                        title: '',
                        text: '',
                        ...state.set.problems[problemToEditIndex],
                        ...payload,
                    },
                    ...state.set.problems.filter((_, index) => index > problemToEditIndex),
                ],
            },
        };
    }
    case 'SET_TEMP_PALETTE':
        return {
            ...state,
            tempPalettes: payload.palettes,
        };
    case 'SET_REVIEW_SOLUTIONS':
        return {
            ...state,
            ...payload,
            set: {
                id: payload.id,
                problems: payload.solutions.map(solution => solution.problem),
                editCode: payload.editCode,
                shareCode: payload.reviewCode,
                title: payload.title || state.set.title,
                archiveMode: payload.archiveMode,
                source: payload.source || null,
            },
            newSetSharecode: payload.reviewCode,
        };
    case 'PARTNER_SUBMIT_OPTIONS_SUCCESS':
        return {
            ...state,
            set: {
                ...state.set,
                partner: payload,
            },
        };
    default:
        return state;
    }
};

export default problems;
