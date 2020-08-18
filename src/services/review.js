import axios from 'axios';
import {
    SERVER_URL,
} from '../config';

// import {
//     renderShareToClassroom,
// } from './googleClassroom';

export const shareSolutions = (code, payloadSolutions) => axios.post(`${SERVER_URL}/solution/review/${code}`, payloadSolutions, { withCredentials: true })
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
    if (problem.steps) {
        const steps = [];
        for (let index = 1; index <= problem.steps.length; index += 1) {
            const step = problem.steps[index - 1];
            const nextInProgress = problem.steps[index] && problem.steps[index].inProgress;
            if (problem.editorPosition === null || typeof (problem.editorPosition) === 'undefined') {
                steps.push(step);
            } else if (!nextInProgress || step.inProgress) {
                steps.push({
                    ...step,
                    inProgress: false,
                });
            }
        }
        if (steps.length > 0) {
            return {
                problem,
                steps,
            };
        }
    }
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
