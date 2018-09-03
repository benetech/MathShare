import React, { Component } from 'react'
import MainPageHeader from './components/Header';
import NavigationHeader from './components/Navigation/Header';
import NavigationProblems from './components/Navigation/Problems';
import MainPageFooter from './components/Footer';
import home from './styles.css';
import { NotificationContainer } from 'react-notifications';
import exampleProblem from '../../data/example01.json'; //TODO: Add example problem to the UI
import createAlert from '../../scripts/alert';
import Locales from '../../strings'
import config from '../../../package.json';
import axios from 'axios';
import NewProblemsForm from './components/NewProblemsForm';
import ShareModal from '../ShareModal';
import ConfirmationModal from '../ConfirmationModal';
import PaletteChooser from './components/ButtonsPaletteChooser';

const mathLive = DEBUG_MODE ? require('../../../mathlive/src/mathlive.js')
    : require('../../lib/mathlivedist/mathlive.js');

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            set: {
                problems: [],
                editCode: null,
                sharecode: null
            },
            addProblemsModalActive: false,
            newSetShareModalActive: false,
            shareModalActive: false,
            confirmationModalActive: false,
            addProblemSetModalActive: false,
            paletteChooserModalActive: false,
            allowedPalettes: [],
            theActiveMathField: null,
            textAreaValue: "",
            tempProblems: [],
            tempPalettes: [],
            newSetSharecode: ""
        }
        
        this.textAreaChanged = this.textAreaChanged.bind(this);
        this.deactivateAddProblemSetModal = this.deactivateAddProblemSetModal.bind(this);
        this.activateAddProblemSetModal = this.activateAddProblemSetModal.bind(this);
        this.deactivateAddProblemsModal = this.deactivateAddProblemsModal.bind(this);
        this.activateAddProblemsModal = this.activateAddProblemsModal.bind(this);
        this.deactivatePaletteChooserModal = this.deactivatePaletteChooserModal.bind(this);
        this.activatePaletteChooserModal = this.activatePaletteChooserModal.bind(this);
        this.deactivateShareModal = this.deactivateShareModal.bind(this);
        this.activateShareModal = this.activateShareModal.bind(this);
        this.deactivateNewSetShareModal = this.deactivateNewSetShareModal.bind(this);
        this.activateNewSetShareModal = this.activateNewSetShareModal.bind(this);
        this.deactivateConfirmationModal = this.deactivateConfirmationModal.bind(this);
        this.activateConfirmationModal = this.activateConfirmationModal.bind(this);
        this.addProblem = this.addProblem.bind(this);
        this.saveProblems = this.saveProblems.bind(this);
        this.deleteProblem = this.deleteProblem.bind(this);
        this.updatePositions = this.updatePositions.bind(this);
        this.addProblemSet = this.addProblemSet.bind(this);
        this.progressToAddingProblems = this.progressToAddingProblems.bind(this);
        this.saveProblemSet = this.saveProblemSet.bind(this);
    }

    componentDidMount() {
        var path;
        if (this.props.match.params.action === "view") {
            path = `${config.serverUrl}/problemSet/revision/${this.props.match.params.code}`
        } else {
            path = `${config.serverUrl}/problemSet/${this.props.match.params.code}/`
        }
        axios.get(path)
                .then(response => {
                    this.setState({
                        set: {
                            problems: response.data.problems,
                            editCode: response.data.editCode,
                            sharecode: response.data.shareCode
                        }});
                });
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.set !== prevState.set || this.state.addProblemsModalActive !== prevState.addProblemsModalActive 
            || this.state.newSetShareModalActive !== prevState.newSetShareModalActive || this.state.shareModalActive !== prevState.shareModalActive 
            || this.state.confirmationModalActive !== prevState.confirmationModalActive || this.state.addProblemSetModalActive !== prevState.addProblemSetModalActive 
            || this.state.paletteChooserModalActive !== prevState.paletteChooserModalActive || this.state.allowedPalettes !== prevState.allowedPalettes 
            || this.state.tempProblems !== prevState.tempProblems || this.state.tempPalettes !== prevState.tempPalettes 
            || this.state.newSetSharecode !== prevState.newSetSharecode)
        mathLive.renderMathInDocument();
    }

    textAreaChanged(text) {
        this.setState({textAreaValue : text});
    }

    deactivateAddProblemSetModal() {
        this.setState({ 
            addProblemSetModalActive: false,
            tempProblems: []
        });
    };

    activateAddProblemSetModal() {
        this.setState({ addProblemSetModalActive: true });
    };

    deactivateAddProblemsModal() {
        this.setState({ addProblemsModalActive: false });
    };

    activateAddProblemsModal() {
        this.setState({ addProblemsModalActive: true });
    };

    deactivatePaletteChooserModal() {
        this.setState({ paletteChooserModalActive: false });
    };

    activatePaletteChooserModal() {
        this.setState({ paletteChooserModalActive: true });
    };

    deactivateShareModal() {
        this.setState({ shareModalActive: false });
    };

    activateShareModal() {
        this.setState({ shareModalActive: true });
    };

    deactivateNewSetShareModal() {
        this.setState({ newSetShareModalActive: false });
    };

    activateNewSetShareModal() {
        this.setState({ newSetShareModalActive: true });
    };

    deactivateConfirmationModal() {
        this.setState({ 
            confirmationModalActive: false, 
            problemToDeleteIndex: undefined
        });
    };

    activateConfirmationModal(index) {
        this.setState({ 
            confirmationModalActive: true,
            problemToDeleteIndex: index 
        });
    };

    addProblem(imageData) {
        var message;
        if (this.state.textAreaValue === "") {
            if (this.state.theActiveMathField.latex() === "") {
                message = Locales.strings.no_problem_equation_and_title_warning;
            } else {
                message = Locales.strings.no_problem_title_warning;
            }
        } else if (this.state.theActiveMathField.latex() === "") {
            message = Locales.strings.no_problem_equation_warning;
        }

        if (message != undefined) {
            createAlert('warning', message, Locales.strings.warning);
            setTimeout(function(){
                $('#mathAnnotation').focus();
            }, 6000);
            return;
        }
        
        let newProblems = this.state.tempProblems;
        let mathContent = this.state.theActiveMathField.latex();
        let annotation = this.state.textAreaValue;
        newProblems.push({"text": mathContent , "title": annotation, "scratchpad": imageData});
        
        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex("$$$$");
        this.setState({
            theActiveMathField: updatedMathField,
            textAreaValue: "",
            tempProblems: newProblems
        });

        mathLive.renderMathInDocument();
            
      //  this.setScratchPadContentData(mathStepNewNumber, ScratchPadPainterro.imageSaver.asDataURL())
      //  this.clearScrachPad();
        this.scrollToBottom();
    }

    scrollToBottom() {
        document.querySelector("#container").scrollTo(0, document.querySelector("#container").scrollHeight); //TODO: fix this
    }

    saveProblems() {
        var oldSet = this.state.set;
        oldSet.problems = oldSet.problems.concat(this.state.tempProblems);

        axios.put(`${config.serverUrl}/problemSet/${this.state.set.editCode}`, oldSet)
        .then(response => {
            this.setState({
                set: {
                    problems: response.data.problems,
                    editCode: response.data.editCode,
                    sharecode: response.data.shareCode
                },
                tempProblems: [],
                modalActive: false
            });
        });
        
    }

    deleteProblem(index) {
        var oldSet = this.state.set;
        oldSet.problems.splice(index, 1);
        axios.put(`${config.serverUrl}/problemSet/${this.state.set.editCode}`, oldSet)
        .then(response => {
            this.setState({
                set: {
                    problems: response.data.problems,
                    editCode: response.data.editCode,
                    sharecode: response.data.shareCode
                },
                tempProblems: []
            });
        });

        setTimeout(function() { 
            mathLive.renderMathInDocument();
        }.bind(this), 200)
        this.deactivateConfirmationModal();
    }

    updatePositions(problems) {
        problems.forEach(function(problem, i) {
            problem.position = i;
        })
        var set = this.state.set;
        set.problems = problems;
        this.setState({set});
    }

    addProblemSet() {
        this.activatePaletteChooserModal();
    }

    progressToAddingProblems(palettes) {
        if(palettes.length == 0) {
            createAlert('warning', Locales.strings.no_palettes_chosen_warning, Locales.strings.warning); 
            return;
        }
        this.setState({tempPalettes: palettes});
        this.deactivatePaletteChooserModal();
        this.activateAddProblemSetModal();
    }

    saveProblemSet() {
        var set = {
            problems: this.state.tempProblems,
            palettes: this.state.tempPalettes
        };

        axios.post(`${config.serverUrl}/problemSet/`, set)
        .then(response => {
            this.setState({
                tempProblems: [],
                newSetSharecode: response.data.shareCode
            })
        });
        this.deactivateAddProblemSetModal();
        this.activateNewSetShareModal();
    }

    render() {
        const paletteChooser = this.state.paletteChooserModalActive ?
        <PaletteChooser title={Locales.strings.choose_palettes_title} cancelCallback={this.deactivatePaletteChooserModal}
            nextCallback={this.progressToAddingProblems} />
        : null;

        const shareModal = this.state.shareModalActive ? 
        <ShareModal shareLink={config.serverUrl + '/problemSet/view/' + this.state.set.sharecode} 
            deactivateModal={this.deactivateShareModal}/>
        : null;

        const newSetShareModal = this.state.newSetShareModalActive ? 
        <ShareModal shareLink={config.serverUrl + '/problemSet/view/' + this.state.newSetSharecode} 
            deactivateModal={this.deactivateNewSetShareModal}/>
        : null;

        const confirmationModal = this.state.confirmationModalActive ? 
        <ConfirmationModal redButtonCallback={this.deactivateConfirmationModal} greenButtonCallback={this.deleteProblem}
            deactivateModal={this.deactivateConfirmationModal} title={Locales.strings.confirmation_modal_sure_to_remove_problem}
            redButtonLabel={Locales.strings.cancel} greenButtonLabel={Locales.strings.yes}/>
        : null;

        const addProblemSet = this.state.addProblemSetModalActive
        ? <NewProblemsForm 
            deactivateModal={this.deactivateAddProblemSetModal}
            activateMathField={theActiveMathField => this.setState({theActiveMathField})}
            theActiveMathField={this.state.theActiveMathField}
            textAreaChanged={this.textAreaChanged}
            textAreaValue={this.state.textAreaValue}
            addProblemCallback={this.addProblem}
            problems={this.state.tempProblems}
            saveCallback={this.saveProblemSet}
            cancelCallback={this.deactivateAddProblemSetModal}
            title={Locales.strings.add_problems_new_set}/>
        : null;

        const addProblems = this.state.addProblemsModalActive
        ? <NewProblemsForm 
            deactivateModal={this.deactivateAddProblemsModal}
            activateMathField={theActiveMathField => this.setState({theActiveMathField})}
            theActiveMathField={this.state.theActiveMathField}
            textAreaChanged={this.textAreaChanged}
            textAreaValue={this.state.textAreaValue}
            addProblemCallback={this.addProblem}
            problems={this.state.tempProblems}
            saveCallback={this.saveProblems}
            cancelCallback={this.deactivateAddProblemsModal}
            title={Locales.strings.add_problems}/>
        : null;

        return (
            <div className={home.mainWrapper}>
                <NotificationContainer deactivateModal={this.deactivatePaletteChooserModal}/>
                {confirmationModal}
                {paletteChooser}
                {shareModal}
                {newSetShareModal}
                <MainPageHeader editing={this.props.match.params.action=='edit'} history={this.props.history} shareCallback={this.activateShareModal}
                    addProblemSetCallback={this.addProblemSet}/>
                <div className={home.contentWrapper} id="ContentWrapper">
                {addProblems}
                {addProblemSet}
                    <nav id="LeftNavigation" className={home.leftNavigation} aria-labelledby="LeftNavigationHeader">
                        <NavigationHeader />
                        <NavigationProblems problems={this.state.set.problems} editing={this.props.match.params.action=='edit'}
                            activateModal={this.activateAddProblemsModal} deleteCallback={this.activateConfirmationModal} updatePositions={this.updatePositions} />
                    </nav>
                </div>
                <MainPageFooter />
            </div>
        )
    }
}
