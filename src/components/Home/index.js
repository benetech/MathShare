import React, { Component } from 'react';
import { NotificationContainer } from 'react-notifications';
import { connect } from 'react-redux';
import MainPageHeader from './components/Header';
import NavigationHeader from './components/Navigation/Header';
import NavigationProblems from './components/Navigation/Problems';
import MainPageFooter from './components/Footer';
import NotFound from '../NotFound';
import home from './styles.scss';
import { alertWarning } from '../../scripts/alert';
import Locales from '../../strings';
import ModalContainer, {
    CONFIRMATION, PALETTE_CHOOSER, ADD_PROBLEM_SET,
    EDIT_PROBLEM,
} from '../ModalContainer';
import { FRONTEND_URL } from '../../config';
import {
    addProblem, deleteProblem, requestProblemSet, saveProblems,
    saveProblemSet, setActiveMathField, shareSolutions, setTempPalettes, toggleModals,
} from '../../redux/problemList/actions';
import googleAnalytics from '../../scripts/googleAnalytics';

const mathLive = DEBUG_MODE ? require('../../../../mathlive/src/mathlive.js').default
    : require('../../lib/mathlivedist/mathlive.js');

class Home extends Component {
    componentDidMount() {
        const {
            action, code,
        } = this.props.match.params;
        this.props.requestProblemSet(action, code);
        // mathLive.renderMathInDocument();
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
    }

    shareProblemSet = () => {
        const { action, code } = this.props.match.params;
        this.props.shareSolutions(action, code);
    }

    progressToAddingProblems = (palettes) => {
        if (palettes.length === 0) {
            alertWarning(Locales.strings.no_palettes_chosen_warning, Locales.strings.warning);
            return;
        }
        this.props.setTempPalettes(palettes);
        this.props.toggleModals([PALETTE_CHOOSER, ADD_PROBLEM_SET]);
    }

    saveProblemSet = (orderedProblems) => {
        googleAnalytics(Locales.strings.add_problem_set);
        this.props.saveProblemSet(orderedProblems);
    }

    finishEditing = () => {
        const {
            set,
        } = this.props.problemList;
        this.props.history.push(`/problemSet/view/${set.shareCode}`);
    }

    render() {
        const {
            match,
            problemList,
        } = this.props;
        const {
            params,
        } = match;
        if (problemList.notFound) {
            return <NotFound />;
        }
        return (
            <div className={home.mainWrapper}>
                <NotificationContainer />
                <MainPageHeader
                    editing={params.action === 'edit'}
                    history={this.props.history}
                    addProblemSetCallback={this.addProblemSet}
                    shareProblemSetCallback={this.shareProblemSet}
                    finishEditing={this.finishEditing}
                    editCode={problemList.set.editCode}
                    action={params.action}
                />
                <ModalContainer
                    activeModals={problemList.activeModals}
                    toggleModals={this.props.toggleModals}
                    progressToAddingProblems={this.progressToAddingProblems}
                    deleteProblem={this.deleteProblem}
                    shareLink={`${FRONTEND_URL}/problemSet/view/${problemList.set.shareCode}`}
                    newSetShareLink={`${FRONTEND_URL}/problemSet/view/${problemList.newSetSharecode}`}
                    problemSetShareLink={`${FRONTEND_URL}/problemSet/review/${problemList.problemSetShareCode}`}
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
                <main id="LeftNavigation" className={home.leftNavigation}>
                    <NavigationHeader />
                    <NavigationProblems
                        problems={problemList.set.problems}
                        editing={params.action === 'edit'}
                        activateModals={this.props.toggleModals}
                        updatePositions={this.updatePositions}
                        action={params.action}
                        code={params.code}
                    />
                </main>
                <MainPageFooter />
            </div>
        );
    }
}

export default connect(
    state => ({
        problemList: state.problemList,
    }),
    {
        addProblem,
        deleteProblem,
        requestProblemSet,
        setActiveMathField,
        setTempPalettes,
        saveProblems,
        saveProblemSet,
        shareSolutions,
        toggleModals,
    },
)(Home);
