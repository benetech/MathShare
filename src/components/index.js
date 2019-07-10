import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NotificationContainer } from 'react-notifications';
import {
    Switch, Redirect, Route, withRouter,
} from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faSignature, faSquareRootAlt,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import * as dayjs from 'dayjs';
import PageIndex from './PageIndex';
import NotFound from './NotFound';
import Home from './Home';
import Editor from './Editor';
import MainPageFooter from './Home/components/Footer';
import Locales from '../strings';
import ModalContainer, {
    CONFIRMATION, CONFIRMATION_BACK, PALETTE_CHOOSER, // ADD_PROBLEM_SET,
    EDIT_PROBLEM, SHARE_SET, VIEW_SET,
} from './ModalContainer';
import { alertWarning, alertSuccess } from '../scripts/alert';
import googleAnalytics from '../scripts/googleAnalytics';
import { SERVER_URL, FRONTEND_URL } from '../config';
import problemListActions from '../redux/problemList/actions';
import problemActions from '../redux/problem/actions';

const mathLive = DEBUG_MODE ? require('../../mathlive/src/mathlive.js').default
    : require('../lib/mathlivedist/mathlive.js');

class App extends Component {
    constructor(props) {
        super(props);
        this.initializeIcons();
    }

    shouldComponentUpdate() {
        return true;
    }

    initializeIcons = () => {
        library.add(faSignature, faSquareRootAlt);
    }


    addProblem = (imageData, text, index, newProblemSet) => {
        if (!this.validateProblem(text, imageData)) {
            return false;
        }
        this.props.addProblem(imageData, text, index, newProblemSet);
        return true;
    }

    validateProblem = (text, image) => {
        const {
            problemList,
        } = this.props;
        let message;
        if (text === '' || $.trim(text).length === 0) {
            if (problemList.theActiveMathField.latex() === '' && image === null) {
                message = Locales.strings.no_problem_equation_or_image_and_title_warning;
            } else {
                message = Locales.strings.no_problem_title_warning;
            }
        } else if (problemList.theActiveMathField.latex() === '' && image === null) {
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

    deleteProblem = () => {
        this.props.deleteProblem();
        setTimeout(() => {
            mathLive.renderMathInDocument();
        }, 200);
        this.props.toggleModals([CONFIRMATION]);
    }

    editProblem = (imageData, title) => {
        if (!this.validateProblem(title, imageData)) {
            return;
        }
        this.props.editProblem(imageData, title);
        setTimeout(() => {
            mathLive.renderMathInDocument();
        }, 200);
        this.props.toggleModals([EDIT_PROBLEM]);
    }

    updatePositions = (problems) => {
        const updatedProblems = problems.map((problem, position) => ({
            ...problem,
            position,
        }));
        this.props.saveProblems(updatedProblems);
    }

    addProblemSet = () => {
        this.props.toggleModals([PALETTE_CHOOSER]);
        googleAnalytics('new problem set button');
    }

    progressToAddingProblems = (palettes) => {
        if (palettes.length === 0) {
            alertWarning(Locales.strings.no_palettes_chosen_warning, Locales.strings.warning);
            return;
        }
        this.props.setTempPalettes(palettes);
        // this.props.toggleModals([PALETTE_CHOOSER, ADD_PROBLEM_SET]);
        this.props.toggleModals([PALETTE_CHOOSER]);
        this.props.history.push('/app/problemSet/new');
        this.props.saveProblemSet([], `New Problem Set ${dayjs().format('MM-DD-YYYY')}`, null);
    }

    saveProblemSet = (orderedProblems, title) => {
        googleAnalytics(Locales.strings.add_problem_set);
        this.props.saveProblemSet(orderedProblems, title);
    }

    // finishEditing = () => {
    //     const {
    //         set,
    //     } = this.props.problemList;
    //     this.props.history.push(`/app/problemSet/view/${set.shareCode}`);
    // }

    compareStepArrays = (first, second) => {
        if (first.length !== second.length) {
            return false;
        }
        for (let i = 0; i < first.length; i += 1) {
            if (first[i].stepValue !== second[i].stepValue
                || first[i].explanation !== second[i].explanation
                || first[i].scratchpad !== second[i].scratchpad) {
                return false;
            }
        }
        return true;
    }

    saveProblem = () => new Promise((resolve, reject) => {
        if (this.props.example) {
            this.props.updateProblemStore({ editLink: Locales.strings.example_edit_code });
            resolve(true);
        } else {
            googleAnalytics('Save Problem');
            axios.put(`${SERVER_URL}/solution/${this.props.problemStore.solution.editCode}`, this.props.problemStore.solution)
                .then((response) => {
                    const { problemStore } = this.props;
                    this.props.updateProblemSolution(response.data);
                    const editCode = problemStore.solution.editCode;
                    const steps = problemStore.solution.steps;
                    this.props.updateProblemStore({
                        editLink: `${FRONTEND_URL}/app/problem/edit/${editCode}`,
                        stepsFromLastSave: JSON.parse(JSON.stringify(steps)),
                        lastSaved: (new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })),
                        isUpdated: false,
                    });
                    alertSuccess(Locales.strings.problem_saved_success_message,
                        Locales.strings.success);
                    resolve(true);
                }).catch((error) => {
                    reject(error);
                });
        }
    })

    finishProblem = () => {
        this.saveProblem().then(() => {
            this.goBack();
        });
    }

    shareProblem = () => {
        if (this.props.example) {
            this.props.updateProblemStore({
                shareLink: Locales.strings.example_share_code,
            });
            this.props.toggleModals([SHARE_SET]);
        } else {
            googleAnalytics('Share Problem');
            this.props.updateProblemSolution(this.props.problemStore.solution);
            axios.put(`${SERVER_URL}/solution/${this.props.problemStore.solution.editCode}`, this.props.problemStore.solution)
                .then((response) => {
                    this.props.updateProblemStore({
                        shareLink: `${FRONTEND_URL}/app/problem/view/${response.data.shareCode}`,
                    });
                    this.props.toggleModals([SHARE_SET]);
                });
        }
    }

    viewProblem = () => {
        this.props.toggleModals([VIEW_SET]);
    }

    saveProblemCallback = () => {
        this.props.toggleModals([CONFIRMATION_BACK]);
        this.saveProblem();
    }

    goBack = () => {
        const { problemStore } = this.props;
        if (!this.compareStepArrays(problemStore.solution.steps, problemStore.stepsFromLastSave)
            && !this.props.example) {
            this.props.toggleModals([CONFIRMATION_BACK]);
        } else {
            this.props.history.goBack();
        }
    }

    render() {
        const commonProps = this.props;
        const { modal, problemList, problemStore } = this.props;
        return (
            <React.Fragment>
                <NotificationContainer />
                <div className="body-container">
                    <ModalContainer
                        activeModals={modal.activeModals}
                        toggleModals={this.props.toggleModals}
                        updateProblemSetTitle={this.props.updateProblemSetTitle}
                        progressToAddingProblems={this.progressToAddingProblems}
                        deleteProblem={this.deleteProblem}
                        shareLink={problemStore.shareLink}
                        newSetShareLink={`${FRONTEND_URL}/app/problemSet/view/${problemList.newSetSharecode}`}
                        problemSetShareLink={`${FRONTEND_URL}/app/problemSet/review/${problemList.problemSetShareCode}`}
                        activateMathField={field => this.props.setActiveMathField(field)}
                        theActiveMathField={problemList.theActiveMathField}
                        addProblemCallback={this.addProblem}
                        problems={problemList.set.problems}
                        tempSet={problemList.tempSet}
                        saveProblemSet={this.saveProblemSet}
                        saveProblems={this.props.saveProblems}
                        problemToEdit={problemList.problemToEdit}
                        editProblemCallback={this.editProblem}
                        history={this.props.history}
                        updateTempSet={this.props.updateTempSet}
                        {...problemStore}
                        {...this}

                    />
                    <Switch>
                        <Route exact path="/app/problemSet/:action/:code?" render={p => <Home {...commonProps} {...p} {...this} />} />
                        <Route exact path="/app/problem/:action/:code" render={p => <Editor {...commonProps} {...p} {...this} />} />
                        <Route exact path="/app/problem/example" render={p => <Editor example {...commonProps} {...p} {...this} />} />
                        <Route exact path="/app" render={p => <PageIndex {...commonProps} {...p} {...this} />} />
                        <Route exact path="/">
                            <Redirect to="/app" />
                        </Route>
                        <Route render={p => <NotFound {...p} />} />
                    </Switch>
                </div>
                <MainPageFooter customClass="footer" />
            </React.Fragment>
        );
    }
}

export default withRouter(connect(
    state => ({
        problemList: state.problemList,
        problemStore: state.problem,
        modal: state.modal,
    }),
    {
        ...problemActions,
        ...problemListActions,
    },
)(App));
