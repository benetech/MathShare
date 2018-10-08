import React, { Component } from 'react';
import NewProblemsForm from '../Home/components/NewProblemsForm';
import ShareModal from './components/ShareModal';
import ConfirmationModal from './components/ConfirmationModal';
import PaletteChooser from '../Home/components/ButtonsPaletteChooser';
import Locales from '../../strings';

const CONFIRMATION = 'confirmation';
const PALETTE_CHOOSER = 'paletteChooser';
const ADD_PROBLEM_SET = 'addProblemSet';
const ADD_PROBLEMS = 'addProblems';
const SHARE_NEW_SET = 'shareNewSet';
const SHARE_SET = 'shareSet';
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
                    redButtonCallback={this.props.redButtonCallback}
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
                    cancelCallback={() => this.props.toggleModals([EDIT_PROBLEM])}
                    editing
                    addingProblem
                    problemToEdit={this.props.problemToEdit}
                    title={Locales.strings.edit_problem}
                />
            )
            : null;

        return (
            <div>
                {shareModal}
                {confirmationModal}
                {confirmationBackModal}
                {paletteChooser}
                {newSetShareModal}
                {addProblems}
                {addProblemSet}
                {editProblem}
            </div>
        );
    }
}

export {
    CONFIRMATION, PALETTE_CHOOSER, ADD_PROBLEM_SET, ADD_PROBLEMS,
    SHARE_NEW_SET, SHARE_SET, EDIT_PROBLEM, CONFIRMATION_BACK,
};
