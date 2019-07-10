import axios from 'axios';
import {
    SERVER_URL,
} from '../config';

export const shareSolutions = (action, code, payloadSolutions) => axios.post(`${SERVER_URL}/solution/review/${code}`, payloadSolutions)
    .then((response) => {
        const {
            solutions,
            reviewCode,
        } = response.data;
        if (typeof (window) !== 'undefined') {
            window.gapi.sharetoclassroom.render('submitInClassroom', {
                url: `${window.location.origin}/#/app/problem/review/${reviewCode}`,
            });
        }
        return {
            solutions,
            reviewCode,
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
    shareSolutions,
    createReviewProblemSetOnUpdate,
};
