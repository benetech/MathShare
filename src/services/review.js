import axios from 'axios';
import {
    SERVER_URL,
} from '../config';

// import {
//     renderShareToClassroom,
// } from './googleClassroom';

export const shareSolutions = (code, payloadSolutions) => axios.post(`${SERVER_URL}/solution/review/${code}`, payloadSolutions)
    .then((response) => {
        const {
            solutions,
            editCode,
            reviewCode,
        } = response.data;
        // renderShareToClassroom(
        //     'submitInClassroom',
        //     `/#/app/problemSet/review/${reviewCode}`,
        // );
        return {
            solutions,
            reviewCode,
            editCode,
        };
    });

export const getSolutionObjectFromProblems = problems => problems.map((problem) => {
    const step = {
        explanation: problem.title,
        stepValue: problem.text,
        deleted: false,
        cleanup: null,
        scratchpad: null,
    };
    return {
        problem,
        steps: [step],
    };
});

export const createReviewProblemSetOnUpdate = (problems, shareCode) => {
    const action = 'view';
    const solutions = getSolutionObjectFromProblems(problems);
    return shareSolutions(action, shareCode, solutions);
};

export default {
    createReviewProblemSetOnUpdate,
    getSolutionObjectFromProblems,
    shareSolutions,
};
