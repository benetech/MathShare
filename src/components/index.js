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
import PageIndex from './PageIndex';
import NotFound from './NotFound';
import Home from './Home';
import Editor from './Editor';
import MainPageFooter from './Home/components/Footer';
import Locales from '../strings';
import ModalContainer, {
    CONFIRMATION, PALETTE_CHOOSER, ADD_PROBLEM_SET,
    EDIT_PROBLEM,
} from './ModalContainer';
import { alertWarning } from '../scripts/alert';
import googleAnalytics from '../scripts/googleAnalytics';
import { FRONTEND_URL } from '../config';
import problemActions from '../redux/problemList/actions';

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
        this.props.updateProblemList(problems.map((problem, position) => ({
            ...problem,
            position,
        })));
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
        this.props.toggleModals([PALETTE_CHOOSER, ADD_PROBLEM_SET]);
    }

    saveProblemSet = (orderedProblems, title) => {
        googleAnalytics(Locales.strings.add_problem_set);
        this.props.saveProblemSet(orderedProblems, title);
    }

    finishEditing = () => {
        const {
            set,
        } = this.props.problemList;
        this.props.history.push(`/app/problemSet/view/${set.shareCode}`);
    }

    render() {
        const commonProps = this.props;
        const { problemList } = this.props;
        return (
            <React.Fragment>
                <NotificationContainer />
                <div className="body-container">
                    <ModalContainer
                        activeModals={problemList.activeModals}
                        toggleModals={this.props.toggleModals}
                        progressToAddingProblems={this.progressToAddingProblems}
                        deleteProblem={this.deleteProblem}
                        shareLink={`${FRONTEND_URL}/app/problemSet/view/${problemList.set.shareCode}`}
                        newSetShareLink={`${FRONTEND_URL}/app/problemSet/view/${problemList.newSetSharecode}`}
                        problemSetShareLink={`${FRONTEND_URL}/app/problemSet/review/${problemList.problemSetShareCode}`}
                        activateMathField={field => this.props.setActiveMathField(field)}
                        theActiveMathField={problemList.theActiveMathField}
                        addProblemCallback={this.addProblem}
                        problems={problemList.set.problems}
                        tempProblems={problemList.tempProblems}
                        saveProblemSet={this.saveProblemSet}
                        saveProblems={this.props.saveProblems}
                        problemToEdit={problemList.problemToEdit}
                        editProblemCallback={this.editProblem}
                    />
                    <Switch>
                        <Route exact path="/app/problemSet/:action/:code" render={p => <Home {...commonProps} {...p} {...this} />} />
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
    }),
    problemActions,
)(App));
