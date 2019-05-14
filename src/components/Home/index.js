import React, { Component } from 'react';
import { NotificationContainer } from 'react-notifications';
import axios from 'axios';
import MainPageHeader from './components/Header';
import NavigationHeader from './components/Navigation/Header';
import NavigationProblems from './components/Navigation/Problems';
import MainPageFooter from './components/Footer';
import NotFound from '../NotFound';
import home from './styles.scss';
import { alertWarning } from '../../scripts/alert';
import Locales from '../../strings';
import ModalContainer, {
    CONFIRMATION, PALETTE_CHOOSER, ADD_PROBLEM_SET, SHARE_NEW_SET,
    EDIT_PROBLEM, SHARE_PROBLEM_SET,
} from '../ModalContainer';
import { SERVER_URL, FRONTEND_URL } from '../../config';
import {
    createReviewProblemSetOnUpdate,
    getLocalSolutions,
    getSolutionObjectFromProblems,
    shareSolutions,
    storeSolutionsLocally,
} from '../../services/review';
import scrollTo from '../../scripts/scrollTo';
import googleAnalytics from '../../scripts/googleAnalytics';

const mathLive = DEBUG_MODE ? require('../../../../mathlive/src/mathlive.js').default
    : require('../../lib/mathlivedist/mathlive.js');

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            set: {
                problems: [],
                editCode: null,
                shareCode: null,
            },
            activeModals: [],
            allowedPalettes: [],
            theActiveMathField: null,
            tempPalettes: [],
            tempProblems: [],
            newSetSharecode: '',
            notFound: false,
        };

        this.toggleModals = this.toggleModals.bind(this);
        this.addProblem = this.addProblem.bind(this);
        this.saveProblems = this.saveProblems.bind(this);
        this.deleteProblem = this.deleteProblem.bind(this);
        this.editProblem = this.editProblem.bind(this);
        this.updatePositions = this.updatePositions.bind(this);
        this.addProblemSet = this.addProblemSet.bind(this);
        this.progressToAddingProblems = this.progressToAddingProblems.bind(this);
        this.saveProblemSet = this.saveProblemSet.bind(this);
        this.finishEditing = this.finishEditing.bind(this);
        this.shareProblemSet = this.shareProblemSet.bind(this);
    }

    componentDidMount() {
        let path;
        const action = this.props.match.params.action;
        if (action === 'view') {
            path = `${SERVER_URL}/problemSet/revision/${this.props.match.params.code}`;
        } else if (action === 'review') {
            path = `${SERVER_URL}/solution/review/${this.props.match.params.code}`;
        } else {
            path = `${SERVER_URL}/problemSet/${this.props.match.params.code}/`;
        }

        axios.get(path)
            .then((response) => {
                if (response.status !== 200) {
                    this.setState({ notFound: true });
                }
                if (action === 'review') {
                    const { solutions } = response.data;
                    storeSolutionsLocally(
                        action,
                        this.props.match.params.code,
                        solutions,
                    );
                    this.setState({
                        set: {
                            problems: solutions.map(solution => solution.problem),
                            shareCode: this.props.match.params.code,
                        },
                    });
                } else {
                    let promise;
                    const orderedProblems = this.orderProblems(response.data.problems);
                    const code = orderedProblems[0].problemSetRevisionShareCode;
                    const existingSolutions = getLocalSolutions('view', code);
                    if (!existingSolutions || existingSolutions.length === 0) {
                        const solutions = getSolutionObjectFromProblems(orderedProblems);
                        storeSolutionsLocally('view', code, solutions);
                        promise = shareSolutions('view', code);
                    } else {
                        promise = new Promise((resolve) => {
                            resolve();
                        });
                    }
                    promise.then(() => {
                        this.setState({
                            set: {
                                problems: orderedProblems,
                                editCode: response.data.editCode,
                                shareCode: response.data.shareCode,
                            },
                        });
                    });
                }
            }).catch(() => {
                this.setState({ notFound: true });
            });
        // mathLive.renderMathInDocument();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.set !== prevState.set || this.state.allowedPalettes
            !== prevState.allowedPalettes || this.state.tempPalettes !== prevState.tempPalettes
            || this.state.newSetSharecode !== prevState.newSetSharecode
            || this.state.activeModals !== prevState.activeModals) {
            // mathLive.renderMathInDocument();
            // The state needs to be refreshed at this point
            // so the equations overflow could be detected
            setTimeout(() => { this.setState({}); }, 1);
        }
    }

    /* eslint-disable no-param-reassign */
    orderProblems = problems => problems.map((problem, i) => {
        problem.position = i;
        return problem;
    })
    /* eslint-enable no-param-reassign */

    scrollToBottom = () => {
        scrollTo('container', 'myWorkFooter');
    }

    addProblem(imageData, text, index, newProblemSet) {
        if (!this.validateProblem(text, imageData)) {
            return false;
        }

        let problems;
        this.setState((prevState) => {
            problems = newProblemSet ? prevState.tempProblems : prevState.set.problems;
            const mathContent = prevState.theActiveMathField;
            const annotation = text;
            problems.push({
                text: mathContent.latex(),
                title: annotation,
                scratchpad: imageData,
                position: index,
            });

            mathContent.latex('$$$$');
            return { theActiveMathField: mathContent };
        }, () => {
            // eslint-disable-next-line no-unused-expressions
            newProblemSet
                ? this.setState({
                    tempProblems: problems,
                }) : this.saveProblems(problems);
            // mathLive.renderMathInDocument();
            this.scrollToBottom();
        });
        return true;
    }

    validateProblem(text, image) {
        let message;
        if (text === '' || $.trim(text).length === 0) {
            if (this.state.theActiveMathField.latex() === '' && image === null) {
                message = Locales.strings.no_problem_equation_or_image_and_title_warning;
            } else {
                message = Locales.strings.no_problem_title_warning;
            }
        } else if (this.state.theActiveMathField.latex() === '' && image === null) {
            message = Locales.strings.no_problem_equation_or_image_warning;
        }

        if (message) {
            alertWarning(message, Locales.strings.warning);
            setTimeout(() => {
                $('#mathAnnotation').focus();
            }, 6000);
            return false;
        }
        return true;
    }

    toggleModals(modals, index) {
        this.setState((prevState) => {
            let oldModals = prevState.activeModals;
            // eslint-disable-next-line no-restricted-syntax
            for (const modal of modals) {
                if (oldModals.indexOf(modal) !== -1) {
                    oldModals = oldModals.filter(e => e !== modal);
                } else {
                    if (modal === ADD_PROBLEM_SET) {
                        this.setState({
                            tempProblems: [],
                        });
                    } else if (modal === CONFIRMATION) {
                        this.setState({
                            problemToDeleteIndex: index,
                        });
                    } else if (modal === EDIT_PROBLEM) {
                        this.setState({
                            problemToEditIndex: index,
                            problemToEdit: prevState.set.problems[index],
                        });
                    }
                    oldModals.push(modal);
                }
            }
            return { activeModals: oldModals };
        });
    }

    saveProblems(newProblems) {
        const oldSet = this.state.set;
        oldSet.problems = newProblems;

        axios.put(`${SERVER_URL}/problemSet/${this.state.set.editCode}`, oldSet)
            .then(({ data }) => {
                const { editCode, problems, shareCode } = data;
                createReviewProblemSetOnUpdate(problems, shareCode);
                this.setState({
                    set: {
                        problems,
                        editCode,
                        shareCode,
                    },
                });
            });
    }

    deleteProblem() {
        const oldSet = this.state.set;
        oldSet.problems.splice(this.state.problemToDeleteIndex, 1);
        axios.put(`${SERVER_URL}/problemSet/${this.state.set.editCode}`, oldSet)
            .then(({ data }) => {
                const { editCode, problems, shareCode } = data;
                createReviewProblemSetOnUpdate(problems, shareCode);
                this.setState({
                    set: {
                        problems,
                        editCode,
                        shareCode,
                    },
                });
            });

        setTimeout(() => {
            mathLive.renderMathInDocument();
        }, 200);
        this.toggleModals([CONFIRMATION]);
    }

    editProblem(imageData, title) {
        if (!this.validateProblem(title, imageData)) {
            return;
        }
        const oldSet = this.state.set;
        oldSet.problems[this.state.problemToEditIndex].title = title;
        oldSet.problems[this.state.problemToEditIndex].scratchpad = imageData;
        oldSet.problems[this.state.problemToEditIndex].text = this.state.theActiveMathField.latex();

        axios.put(`${SERVER_URL}/problemSet/${this.state.set.editCode}`, oldSet)
            .then(({ data }) => {
                const { editCode, problems, shareCode } = data;
                createReviewProblemSetOnUpdate(problems, shareCode);
                this.setState({
                    set: {
                        problems,
                        editCode,
                        shareCode,
                    },
                });
            });

        setTimeout(() => {
            mathLive.renderMathInDocument();
        }, 200);
        this.toggleModals([EDIT_PROBLEM]);
    }

    /* eslint-disable no-param-reassign */
    updatePositions(problems) {
        problems.forEach((problem, i) => {
            problem.position = i;
        });

        this.setState((state) => {
            const set = state.set;
            set.problems = problems;
            return { set };
        });
    }
    /* eslint-enable no-param-reassign */

    addProblemSet() {
        this.toggleModals([PALETTE_CHOOSER]);
    }

    shareProblemSet() {
        const { code, action } = this.props.match.params;
        shareSolutions(action, code)
            .then(({ reviewCode }) => {
                this.setState({
                    problemSetShareCode: reviewCode,
                }, this.toggleModals([SHARE_PROBLEM_SET]));
            })
            .catch((e) => {
                console.log(e);
            });
    }

    progressToAddingProblems(palettes) {
        if (palettes.length === 0) {
            alertWarning(Locales.strings.no_palettes_chosen_warning, Locales.strings.warning);
            return;
        }
        this.setState({ tempPalettes: palettes });
        this.toggleModals([PALETTE_CHOOSER, ADD_PROBLEM_SET]);
    }

    saveProblemSet(orderedProblems) {
        googleAnalytics(Locales.strings.add_problem_set);
        const set = {
            problems: orderedProblems,
            palettes: this.state.tempPalettes,
        };

        axios.post(`${SERVER_URL}/problemSet/`, set)
            .then((response) => {
                this.setState({
                    tempProblems: [],
                    newSetSharecode: response.data.shareCode,
                });
            });
        this.toggleModals([ADD_PROBLEM_SET, SHARE_NEW_SET]);
    }

    finishEditing() {
        this.props.history.push(`/problemSet/view/${this.state.set.shareCode}`);
    }

    render() {
        if (this.state.notFound) {
            return <NotFound />;
        }
        return (
            <div className={home.mainWrapper}>
                <NotificationContainer />
                <MainPageHeader
                    editing={this.props.match.params.action === 'edit'}
                    history={this.props.history}
                    shareCallback={this.toggleModals}
                    addProblemSetCallback={this.addProblemSet}
                    shareProblemSetCallback={this.shareProblemSet}
                    finishEditing={this.finishEditing}
                    editCode={this.state.set.editCode}
                    action={this.props.match.params.action}
                />
                <ModalContainer
                    activeModals={this.state.activeModals}
                    toggleModals={this.toggleModals}
                    progressToAddingProblems={this.progressToAddingProblems}
                    deleteProblem={this.deleteProblem}
                    shareLink={`${FRONTEND_URL}/problemSet/view/${this.state.set.shareCode}`}
                    newSetShareLink={`${FRONTEND_URL}/problemSet/view/${this.state.newSetSharecode}`}
                    problemSetShareLink={`${FRONTEND_URL}/problemSet/review/${this.state.problemSetShareCode}`}
                    activateMathField={theActiveMathField => this.setState({ theActiveMathField })}
                    theActiveMathField={this.state.theActiveMathField}
                    addProblemCallback={this.addProblem}
                    problems={this.state.set.problems}
                    tempProblems={this.state.tempProblems}
                    saveProblemSet={this.saveProblemSet}
                    saveProblems={this.saveProblems}
                    problemToEdit={this.state.problemToEdit}
                    editProblemCallback={this.editProblem}
                />
                <main id="LeftNavigation" className={home.leftNavigation}>
                    <NavigationHeader />
                    <NavigationProblems
                        problems={this.state.set.problems}
                        editing={this.props.match.params.action === 'edit'}
                        activateModals={this.toggleModals}
                        updatePositions={this.updatePositions}
                        action={this.props.match.params.action}
                        code={this.props.match.params.code}
                    />
                </main>
                <MainPageFooter />
            </div>
        );
    }
}
