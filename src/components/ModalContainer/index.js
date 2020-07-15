import React from 'react';
import NewProblemsForm from '../Home/components/NewProblemsForm';
import ProblemSetShareModal from './components/ProblemSetShareModal';
import ConfirmationModal from './components/ConfirmationModal';
import TitleEditModal from './components/TitleEditModal';
import PersonalizationModal from './components/PersonalizationModal';
import PaletteChooser from '../Home/components/ButtonsPaletteChooser';
import Locales from '../../strings';

const CONFIRMATION = 'confirmation';
const PALETTE_CHOOSER = 'paletteChooser';
const PALETTE_UPDATE_CHOOSER = 'paletteUpdateChooser';
const ADD_PROBLEM_SET = 'addProblemSet';
const ADD_PROBLEMS = 'addProblems';
const SHARE_NEW_SET = 'shareNewSet';
const SHARE_PROBLEM_SET = 'shareProblemSet';
const EDIT_PROBLEM = 'editProblem';
const CONFIRMATION_BACK = 'confirmationBack';
const TITLE_EDIT_MODAL = 'titleEditModal';
const PERSONALIZATION_SETTINGS = 'personalizationSettings';

const ModalContainer = (props) => {
    const { activeModals, problemList } = props;
    const { problemToDeleteIndex, problemToEditIndex, set } = problemList;
    let gotoAfterDelete = '';

    if (problemToDeleteIndex) {
        gotoAfterDelete = problemToDeleteIndex;
        if (set.problems.length === gotoAfterDelete) {
            gotoAfterDelete = set.problems.length - 1;
        }
    }

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

    const paletteUpdateChooser = activeModals.includes(PALETTE_UPDATE_CHOOSER)
        ? (
            <PaletteChooser
                title={Locales.strings.choose_palettes_title}
                cancelCallback={() => props.toggleModals([PALETTE_UPDATE_CHOOSER])}
                nextCallback={props.updatePaletteSymbols}
                deactivateModal={() => props.toggleModals([PALETTE_UPDATE_CHOOSER])}
                currentPalettes={props.currentPalettes}
                isUpdate
            />
        )
        : null;

    const newSetShareModal = activeModals.includes(SHARE_NEW_SET)
        ? (
            <ProblemSetShareModal
                shareLink={props.newSetShareLink}
                problemList={props.problemList}
                announceOnAriaLive={props.announceOnAriaLive}
                clearAriaLive={props.clearAriaLive}
                deactivateModal={() => props.toggleModals([SHARE_NEW_SET])}
            />
        )
        : null;

    const confirmationModal = activeModals.includes(CONFIRMATION)
        ? (
            <ConfirmationModal
                focusOnExit={gotoAfterDelete && `#problem-dropdown-${gotoAfterDelete}`}
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
                redButtonCallback={props.goBack(true, props.link)}
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
                focusOnExit="#problem-new > button"
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
                allowedPalettes={props.mathPalettes}
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
                allowedPalettes={props.mathPalettes}
            />
        )
        : null;

    const editProblem = activeModals.includes(EDIT_PROBLEM)
        ? (
            <NewProblemsForm
                focusOnExit={`#problem-dropdown-${problemToEditIndex}`}
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
                allowedPalettes={props.mathPalettes}
            />
        )
        : null;

    const shareProblemSet = activeModals.includes(SHARE_PROBLEM_SET)
        ? (
            <ProblemSetShareModal
                shareLink={props.problemSetShareLink}
                announceOnAriaLive={props.announceOnAriaLive}
                clearAriaLive={props.clearAriaLive}
                problemList={props.problemList}
                deactivateModal={() => props.toggleModals([SHARE_PROBLEM_SET])}
                submitToPartner={props.submitToPartner}
                isSolutionSet
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

    return (
        <>
            {confirmationModal}
            {confirmationBackModal}
            {paletteChooser}
            {paletteUpdateChooser}
            {newSetShareModal}
            {addProblems}
            {addProblemSet}
            {editProblem}
            {shareProblemSet}
            {titleEditModal}
            {personalizationModal}
        </>
    );
};

export default ModalContainer;

export {
    CONFIRMATION, PALETTE_CHOOSER, PALETTE_UPDATE_CHOOSER, ADD_PROBLEM_SET, ADD_PROBLEMS,
    SHARE_PROBLEM_SET, SHARE_NEW_SET, EDIT_PROBLEM,
    CONFIRMATION_BACK, TITLE_EDIT_MODAL, PERSONALIZATION_SETTINGS,
};
