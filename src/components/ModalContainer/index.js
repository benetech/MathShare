import React from 'react';
import NewProblemsForm from '../Home/components/NewProblemsForm';
import ShareModal from './components/ShareModal';
import NewProblemSetShareModal from './components/NewProblemSetShareModal';
import SaveModal from './components/SaveModal';
import ProblemModal from './components/ProblemModal';
import ProblemSetShareModal from './components/ProblemSetShareModal';
import ConfirmationModal from './components/ConfirmationModal';
import TitleEditModal from './components/TitleEditModal';
import PersonalizationModal from './components/PersonalizationModal';
import SignInModal from './components/SignInModal';
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
const TITLE_EDIT_MODAL = 'titleEditModal';
const PERSONALIZATION_SETTINGS = 'personalizationSettings';
const SIGN_IN_MODAL = 'signInModal';

const ModalContainer = (props) => {
    const { activeModals } = props;
    const shareModal = activeModals.includes(SHARE_SET)
        ? (
            <ShareModal
                shareLink={props.shareLink}
                deactivateModal={() => props.toggleModals([SHARE_SET])}
            />
        )
        : null;
    const saveModal = activeModals.includes(SAVE_SET)
        ? (
            <SaveModal
                editLink={props.editLink}
                deactivateModal={() => props.toggleModals([SAVE_SET])}
            />
        )
        : null;

    const paletteChooser = activeModals.includes(PALETTE_CHOOSER)
        ? (
            <PaletteChooser
                title={Locales.strings.choose_palettes_title}
                cancelCallback={() => props.toggleModals([PALETTE_CHOOSER])}
                nextCallback={props.progressToAddingProblems}
                deactivateModal={() => props.toggleModals([PALETTE_CHOOSER])}
            />
        )
        : null;

    const newSetShareModal = activeModals.includes(SHARE_NEW_SET)
        ? (
            <NewProblemSetShareModal
                shareLink={props.newSetShareLink}
                deactivateModal={() => props.toggleModals([SHARE_NEW_SET])}
            />
        )
        : null;

    const confirmationModal = activeModals.includes(CONFIRMATION)
        ? (
            <ConfirmationModal
                redButtonCallback={() => props.toggleModals([CONFIRMATION])}
                greenButtonCallback={props.deleteProblem}
                deactivateModal={() => props.toggleModals([CONFIRMATION])}
                title={Locales.strings.confirmation_modal_sure_to_remove_problem}
                redButtonLabel={Locales.strings.cancel}
                greenButtonLabel={Locales.strings.yes}
            />
        )
        : null;

    const confirmationBackModal = activeModals.includes(CONFIRMATION_BACK)
        ? (
            <ConfirmationModal
                redButtonCallback={() => {
                    props.toggleModals([CONFIRMATION_BACK]);
                    if (props.link) {
                        props.history.replace(props.link);
                    } else {
                        props.history.goBack();
                    }
                }}
                greenButtonCallback={props.saveProblemCallback(props.link === null ? 'back' : props.link)}
                deactivateModal={() => props.toggleModals([CONFIRMATION_BACK])}
                title={Locales.strings.confirmation_modal_unsaved_title}
                redButtonLabel={Locales.strings.discard_changes}
                greenButtonLabel={Locales.strings.save_changes}
            />
        )
        : null;

    const addProblemSet = activeModals.includes(ADD_PROBLEM_SET)
        ? (
            <NewProblemsForm
                deactivateModal={() => props.toggleModals([ADD_PROBLEM_SET])}
                activateMathField={props.activateMathField}
                theActiveMathField={props.theActiveMathField}
                addProblemCallback={props.addProblemCallback}
                problems={props.tempSet.problems}
                updateTempSet={props.updateTempSet}
                problemSetTitle={props.title}
                saveCallback={props.saveProblemSet}
                addingProblem
                cancelCallback={() => props.toggleModals([ADD_PROBLEM_SET])}
                title={Locales.strings.add_problems_new_set}
                updateProblemStore={props.updateProblemStore}
                textAreaValue={props.textAreaValue}
                newProblemSet
            />
        )
        : null;

    const addProblems = activeModals.includes(ADD_PROBLEMS)
        ? (
            <NewProblemsForm
                deactivateModal={() => props.toggleModals([ADD_PROBLEMS])}
                activateMathField={props.activateMathField}
                theActiveMathField={props.theActiveMathField}
                addProblemCallback={props.addProblemCallback}
                problems={props.problems}
                problemSetTitle={props.title}
                saveCallback={props.saveProblems}
                updateTempSet={props.updateTempSet}
                addingProblem
                cancelCallback={() => props.toggleModals([ADD_PROBLEMS])}
                title={Locales.strings.add_problems}
                updateProblemStore={props.updateProblemStore}
                textAreaValue={props.textAreaValue}
            />
        )
        : null;

    const editProblem = activeModals.includes(EDIT_PROBLEM)
        ? (
            <NewProblemsForm
                deactivateModal={() => props.toggleModals([EDIT_PROBLEM])}
                activateMathField={props.activateMathField}
                theActiveMathField={props.theActiveMathField}
                textAreaChanged={props.textAreaChanged}
                textAreaValue={props.textAreaValue}
                editProblemCallback={props.editProblemCallback}
                problems={[]}
                problemSetTitle={props.title}
                cancelCallback={() => props.toggleModals([EDIT_PROBLEM])}
                updateTempSet={props.updateTempSet}
                editing
                addingProblem
                problemToEdit={props.problemToEdit}
                title={Locales.strings.edit_problem}
                updateProblemStore={props.updateProblemStore}
            />
        )
        : null;

    const viewProblem = activeModals.includes(VIEW_SET)
        ? (
            <ProblemModal
                solution={props.solution}
                deactivateModal={() => props.toggleModals([VIEW_SET])}
            />
        )
        : null;

    const shareProblemSet = activeModals.includes(SHARE_PROBLEM_SET)
        ? (
            <ProblemSetShareModal
                problemSetShareLink={props.problemSetShareLink}
                deactivateModal={() => props.toggleModals([SHARE_PROBLEM_SET])}
            />
        )
        : null;

    const titleEditModal = activeModals.includes(TITLE_EDIT_MODAL)
        ? (
            <TitleEditModal
                title={props.tempSet.title}
                updateProblemSetTitle={props.updateProblemSetTitle}
                deactivateModal={() => props.toggleModals([TITLE_EDIT_MODAL])}
            />
        )
        : null;

    const personalizationModal = activeModals.includes(PERSONALIZATION_SETTINGS)
        ? (
            <PersonalizationModal
                deactivateModal={() => props.toggleModals([PERSONALIZATION_SETTINGS])}
            />
        )
        : null;

    const signInModal = activeModals.includes(SIGN_IN_MODAL)
        ? (
            <SignInModal
                deactivateModal={() => props.toggleModals([SIGN_IN_MODAL])}
            />
        )
        : null;

    return (
        <>
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
            {titleEditModal}
            {personalizationModal}
            {signInModal}
        </>
    );
};

export default ModalContainer;

export {
    CONFIRMATION, PALETTE_CHOOSER, ADD_PROBLEM_SET, ADD_PROBLEMS, SHARE_PROBLEM_SET,
    SHARE_NEW_SET, SAVE_SET, SHARE_SET, VIEW_SET, EDIT_PROBLEM, CONFIRMATION_BACK, TITLE_EDIT_MODAL,
    PERSONALIZATION_SETTINGS, SIGN_IN_MODAL,
};
