import NewProblemsForm from '../NewProblemsForm';
import ShareModal from '../../../ShareModal';
import ConfirmationModal from '../../../ConfirmationModal';
import PaletteChooser from '../../components/ButtonsPaletteChooser';
import Locales from '../../../../strings'
import React, { Component } from 'react'

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeModals: []
        }
        this.CONFIRMATION_MODAL = "confirmation";
        this.PALETTE_CHOOSER_MODAL = "paletteChooser";
        this.ADD_PROBLEM_SET_MODAL = "addProblemSet";
        this.ADD_PROBLEMS_MODAL = "addProblems";
        this.SHARE_NEW_SET_MODAL = "shareNewSet";
        this.SHARE_SET_MODAL = "shareSet";
    }

    componentWillReceiveProps(np) {
        this.setState({activeModals: np.activeModals});
    }

    render() {
        const shareModal = this.state.activeModals.includes(this.SHARE_SET_MODAL) ?
        <ShareModal shareLink={this.props.shareLink} 
            deactivateModal={() => this.props.toggleModal(this.SHARE_SET_MODAL)}/>
        : null;

        const paletteChooser = this.state.activeModals.includes(this.PALETTE_CHOOSER_MODAL) ?
        <PaletteChooser title={Locales.strings.choose_palettes_title} cancelCallback={() => this.props.toggleModal(this.PALETTE_CHOOSER_MODAL)}
            nextCallback={this.props.progressToAddingProblems} />
        : null;

        const newSetShareModal = this.state.activeModals.includes(this.SHARE_NEW_SET_MODAL) ? 
        <ShareModal shareLink={this.props.newSetShareLink} 
            deactivateModal={() => this.props.toggleModal(this.SHARE_NEW_SET_MODAL)}/>
        : null;

        const confirmationModal = this.state.activeModals.includes(this.CONFIRMATION_MODAL) ? 
        <ConfirmationModal redButtonCallback={() => this.props.toggleModal(this.CONFIRMATION_MODAL)} greenButtonCallback={this.props.deleteProblem}
            deactivateModal={() => this.props.toggleModal(this.CONFIRMATION_MODAL)} title={Locales.strings.confirmation_modal_sure_to_remove_problem}
            redButtonLabel={Locales.strings.cancel} greenButtonLabel={Locales.strings.yes}/>
        : null;

        const addProblemSet = this.state.activeModals.includes(this.ADD_PROBLEM_SET_MODAL)
        ? <NewProblemsForm 
            deactivateModal={() => this.props.toggleModal(this.ADD_PROBLEM_SET_MODAL)}
            activateMathField={this.props.activateMathField}
            theActiveMathField={this.props.theActiveMathField}
            textAreaChanged={this.props.textAreaChanged}
            textAreaValue={this.props.textAreaValue}
            addProblemCallback={this.props.addProblemCallback}
            problems={this.props.problems}
            saveCallback={this.props.saveProblemSet}
            cancelCallback={() => this.props.toggleModal(this.ADD_PROBLEM_SET_MODAL)}
            title={Locales.strings.add_problems_new_set}/>
        : null;

        const addProblems = this.state.activeModals.includes(this.ADD_PROBLEMS_MODAL)
        ? <NewProblemsForm 
            deactivateModal={() => this.props.toggleModal(this.ADD_PROBLEMS_MODAL)}
            activateMathField={this.props.activateMathField}
            theActiveMathField={this.props.theActiveMathField}
            textAreaChanged={this.props.textAreaChanged}
            textAreaValue={this.props.textAreaValue}
            addProblemCallback={this.props.addProblemCallback}
            problems={this.props.problems}
            saveCallback={this.props.saveProblems}
            cancelCallback={() => this.props.toggleModal(this.ADD_PROBLEMS_MODAL)}
            title={Locales.strings.add_problems}/>
        : null;

        return (
            <div>
                {shareModal}
                {confirmationModal}
                {paletteChooser}
                {newSetShareModal}
                {addProblems}
                {addProblemSet}
            </div>
        );
    }
}
