import axios from 'axios';
import {
    SERVER_URL,
} from '../config';

import {
    renderShareToClassroom,
} from './googleClassroom';

export const getLocalSolutions = (action, code) => {
    const key = `${action}_${code}`;
    const existingSolutions = localStorage.getItem(key) || '[]';
    return JSON.parse(existingSolutions);
};

export const getSolutionByProblem = (action, problem, code) => {
    let solutions = [];
    if (action === 'review') {
        solutions = getLocalSolutions(action, code);
    } else {
        solutions = getLocalSolutions(action, problem.problemSetRevisionShareCode);
    }
    return solutions.find(solution => solution.problem.id === problem.id);
};

export const storeSolutionsLocally = (action, code, solutions) => {
    const key = `${action}_${code}`;
    localStorage.setItem(key, JSON.stringify(solutions || []));
};

export const shareSolutions = (action, code) => {
    const existingSolutions = getLocalSolutions(action, code);
    if (!existingSolutions) {
        return new Promise((resolve, reject) => {
            reject(new Error("'No solutions saved'"));
        });
    }
    return axios.post(`${SERVER_URL}/solution/review/${code}`, existingSolutions)
        .then((response) => {
            const {
                solutions,
                reviewCode,
            } = response.data;
            storeSolutionsLocally(action, code, solutions);
            renderShareToClassroom(
                'submitInClassroom',
                `/#/app/problem/review/${reviewCode}`,
            );
            return {
                solutions,
                reviewCode,
            };
        });
};

export const updateSolution = (solution) => {
    const {
        problem,
    } = solution;
    const key = `view_${problem.problemSetRevisionShareCode}`;
    const solutions = JSON.parse(localStorage.getItem(key) || '[]');
    const solutionIndex = solutions.findIndex(
        sol => sol.problem.id === problem.id,
    );
    if (solutionIndex === -1) {
        solutions.push(solution);
    } else {
        solutions[solutionIndex] = solution;
    }
    localStorage.setItem(key, JSON.stringify(solutions));
};

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
    storeSolutionsLocally(action, shareCode, solutions);
    shareSolutions(action, shareCode);
};

export default {
    getLocalSolutions,
    getSolutionByProblem,
    shareSolutions,
};
