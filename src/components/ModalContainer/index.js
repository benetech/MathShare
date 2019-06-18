import React, { Component } from 'react';
import NewProblemsForm from '../Home/components/NewProblemsForm';
import ShareModal from './components/ShareModal';
import SaveModal from './components/SaveModal';
import ProblemModal from './components/ProblemModal';
import ProblemSetShareModal from './components/ProblemSetShareModal';
import ConfirmationModal from './components/ConfirmationModal';
import PaletteChooser from '../Home/components/ButtonsPaletteChooser';
import Locales from '../../strings';

const CONFIRMATION = 'confirmation';
const PALETTE_CHOOSER = 'paletteChooser';
const ADD_PROBLEM_SET = 'addProblemSet';
const ADD_PROBLEMS = 'addProblems';
const SHARE_NEW_SET = 'shareNewSet';
const SHARE_SET = 'shareSet';
const SHARE_PROBLEM_SET = 'shareProblemSet';
const SAVE_SET = 'saveSet';
const VIEW_SET = 'viewSet';
const EDIT_PROBLEM = 'editProblem';
const CONFIRMATION_BACK = 'confirmationBack';

export default class ModalContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeModals: [],
        };
    }

    componentWillReceiveProps(np) {
        this.setState({ activeModals: np.activeModals });
    }

    render() {
        const shareModal = this.state.activeModals.includes(SHARE_SET)
            ? (
                <ShareModal
                    shareLink={this.props.shareLink}
                    deactivateModal={() => this.props.toggleModals([SHARE_SET])}
                />
            )
            : null;
        const saveModal = this.state.activeModals.includes(SAVE_SET)
            ? (
                <SaveModal
                    editLink={this.props.editLink}
                    deactivateModal={() => this.props.toggleModals([SAVE_SET])}
                />
            )
            : null;

        const paletteChooser = this.state.activeModals.includes(PALETTE_CHOOSER)
            ? (
                <PaletteChooser
                    title={Locales.strings.choose_palettes_title}
                    cancelCallback={() => this.props.toggleModals([PALETTE_CHOOSER])}
                    nextCallback={this.props.progressToAddingProblems}
                    deactivateModal={() => this.props.toggleModals([PALETTE_CHOOSER])}
                />
            )
            : null;

        const newSetShareModal = this.state.activeModals.includes(SHARE_NEW_SET)
            ? (
                <ShareModal
                    shareLink={this.props.newSetShareLink}
                    deactivateModal={() => this.props.toggleModals([SHARE_NEW_SET])}
                />
            )
            : null;

        const confirmationModal = this.state.activeModals.includes(CONFIRMATION)
            ? (
                <ConfirmationModal
                    redButtonCallback={() => this.props.toggleModals([CONFIRMATION])}
                    greenButtonCallback={this.props.deleteProblem}
                    deactivateModal={() => this.props.toggleModals([CONFIRMATION])}
                    title={Locales.strings.confirmation_modal_sure_to_remove_problem}
                    redButtonLabel={Locales.strings.cancel}
                    greenButtonLabel={Locales.strings.yes}
                />
            )
            : null;

        const confirmationBackModal = this.state.activeModals.includes(CONFIRMATION_BACK)
            ? (
                <ConfirmationModal
                    redButtonCallback={() => {
                        this.props.toggleModals([CONFIRMATION_BACK]);
                        this.props.history.goBack();
                    }}
                    greenButtonCallback={this.props.greenButtonCallback}
                    deactivateModal={() => this.props.toggleModals([CONFIRMATION_BACK])}
                    title={Locales.strings.confirmation_modal_unsaved_title}
                    redButtonLabel={Locales.strings.discard_changes}
                    greenButtonLabel={Locales.strings.save_changes}
                />
            )
            : null;

        const addProblemSet = this.state.activeModals.includes(ADD_PROBLEM_SET)
            ? (
                <NewProblemsForm
                    deactivateModal={() => this.props.toggleModals([ADD_PROBLEM_SET])}
                    activateMathField={this.props.activateMathField}
                    theActiveMathField={this.props.theActiveMathField}
                    addProblemCallback={this.props.addProblemCallback}
                    problems={this.props.tempProblems}
                    problemSetTitle={this.props.title}
                    saveCallback={this.props.saveProblemSet}
                    addingProblem
                    cancelCallback={() => this.props.toggleModals([ADD_PROBLEM_SET])}
                    title={Locales.strings.add_problems_new_set}
                    newProblemSet
                />
            )
            : null;

        const addProblems = this.state.activeModals.includes(ADD_PROBLEMS)
            ? (
                <NewProblemsForm
                    deactivateModal={() => this.props.toggleModals([ADD_PROBLEMS])}
                    activateMathField={this.props.activateMathField}
                    theActiveMathField={this.props.theActiveMathField}
                    addProblemCallback={this.props.addProblemCallback}
                    problems={this.props.problems}
                    problemSetTitle={this.props.title}
                    saveCallback={this.props.saveProblems}
                    addingProblem
                    cancelCallback={() => this.props.toggleModals([ADD_PROBLEMS])}
                    title={Locales.strings.add_problems}
                />
            )
            : null;

        const editProblem = this.state.activeModals.includes(EDIT_PROBLEM)
            ? (
                <NewProblemsForm
                    deactivateModal={() => this.props.toggleModals([EDIT_PROBLEM])}
                    activateMathField={this.props.activateMathField}
                    theActiveMathField={this.props.theActiveMathField}
                    textAreaChanged={this.props.textAreaChanged}
                    textAreaValue={this.props.textAreaValue}
                    editProblemCallback={this.props.editProblemCallback}
                    problems={[]}
                    problemSetTitle={this.props.title}
                    cancelCallback={() => this.props.toggleModals([EDIT_PROBLEM])}
                    editing
                    addingProblem
                    problemToEdit={this.props.problemToEdit}
                    title={Locales.strings.edit_problem}
                />
            )
            : null;

        const viewProblem = this.state.activeModals.includes(VIEW_SET)
            ? (
                <ProblemModal
                    solution={this.props.solution}
                    deactivateModal={() => this.props.toggleModals([VIEW_SET])}
                />
            )
            : null;

        const shareProblemSet = this.state.activeModals.includes(SHARE_PROBLEM_SET)
            ? (
                <ProblemSetShareModal
                    problemSetShareLink={this.props.problemSetShareLink}
                    deactivateModal={() => this.props.toggleModals([SHARE_PROBLEM_SET])}
                />
            )
            : null;

        return (
            <div>
                {saveModal}
                {shareModal}
                {confirmationModal}
                {confirmationBackModal}
                {paletteChooser}
                {newSetShareModal}
                {addProblems}
                {addProblemSet}
                {editProblem}
                {viewProblem}
                {shareProblemSet}
            </div>
        );
    }
}

export {
    CONFIRMATION, PALETTE_CHOOSER, ADD_PROBLEM_SET, ADD_PROBLEMS, SHARE_PROBLEM_SET,
    SHARE_NEW_SET, SAVE_SET, SHARE_SET, VIEW_SET, EDIT_PROBLEM, CONFIRMATION_BACK,
};
