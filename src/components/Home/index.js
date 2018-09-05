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
import ModalContainer from './components/ModalContainer';

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
            activeModals: [],
            allowedPalettes: [],
            theActiveMathField: null,
            tempProblems: [],
            tempPalettes: [],
            newSetSharecode: ""
        }

        this.toggleModals = this.toggleModals.bind(this);
        this.addProblem = this.addProblem.bind(this);
        this.saveProblems = this.saveProblems.bind(this);
        this.deleteProblem = this.deleteProblem.bind(this);
        this.updatePositions = this.updatePositions.bind(this);
        this.addProblemSet = this.addProblemSet.bind(this);
        this.progressToAddingProblems = this.progressToAddingProblems.bind(this);
        this.saveProblemSet = this.saveProblemSet.bind(this);
        this.finishEditing = this.finishEditing.bind(this);
        this.CONFIRMATION_MODAL = "confirmation";
        this.PALETTE_CHOOSER_MODAL = "paletteChooser";
        this.ADD_PROBLEM_SET_MODAL = "addProblemSet";
        this.ADD_PROBLEMS_MODAL = "addProblems";
        this.SHARE_NEW_SET_MODAL = "shareNewSet";
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
                var orderedProblems = this.orderProblems(response.data.problems);
                this.setState({
                    set: {
                        problems: orderedProblems,
                        editCode: response.data.editCode,
                        sharecode: response.data.shareCode
                    }
                });
            });
        mathLive.renderMathInDocument();
    }

    orderProblems(problems) {
        return problems.map((problem, i) => {
            problem.position = i;
            return problem;
        });
    }

    componentDidUpdate(prevProps, prevState) { //todo:change
        if (this.state.set !== prevState.set || this.state.allowedPalettes !== prevState.allowedPalettes
            || this.state.tempProblems !== prevState.tempProblems || this.state.tempPalettes !== prevState.tempPalettes
            || this.state.newSetSharecode !== prevState.newSetSharecode || this.state.activeModals !== prevState.activeModals)
            mathLive.renderMathInDocument();
    }

    toggleModals(modals, index) {
        var oldModals = this.state.activeModals;
        console.log(modals)
        for (var modal of modals) {
            if (this.state.activeModals.indexOf(modal) != -1) {
                console.log("disabling: ", modal)
                oldModals = oldModals.filter(e => e !== modal);
            } else {
                console.log("enabling: ", modal)
                if (modal == this.ADD_PROBLEM_SET_MODAL || modal == this.ADD_PROBLEMS_MODAL) {
                    this.setState({
                        tempProblems: []
                    });
                } else if (modal == this.CONFIRMATION_MODAL) {
                    this.setState({
                        problemToDeleteIndex: index
                    });
                }
                oldModals.push(modal);
            }
        }
        this.setState({ activeModals: oldModals });
    }

    addProblem(imageData, text, index) {
        var message;
        if (text === "") {
            if (this.state.theActiveMathField.latex() === "") {
                message = Locales.strings.no_problem_equation_and_title_warning;
            } else {
                message = Locales.strings.no_problem_title_warning;
            }
        } else if (this.state.theActiveMathField.latex() === "") {
            message = Locales.strings.no_problem_equation_warning;
        }

        if (message) {
            createAlert('warning', message, Locales.strings.warning);
            setTimeout(function () {
                $('#mathAnnotation').focus();
            }, 6000);
            return;
        }

        let newProblems = this.state.tempProblems;
        let mathContent = this.state.theActiveMathField.latex();
        let annotation = text;
        newProblems.push({ "text": mathContent, "title": annotation, "scratchpad": imageData, "position": index });

        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex("$$$$");
        this.setState({
            theActiveMathField: updatedMathField,
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

    saveProblems(problems) {
        var oldSet = this.state.set;
        oldSet.problems = problems;

        axios.put(`${config.serverUrl}/problemSet/${this.state.set.editCode}`, oldSet)
            .then(response => {
                this.setState({
                    set: {
                        problems: response.data.problems,
                        editCode: response.data.editCode,
                        sharecode: response.data.shareCode
                    },
                    tempProblems: [],
                    activeModals: []
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

        setTimeout(function () {
            mathLive.renderMathInDocument();
        }.bind(this), 200);
        this.toggleModals([this.CONFIRMATION_MODAL], index);
    }

    updatePositions(problems) {
        problems.forEach(function (problem, i) {
            problem.position = i;
        })
        var set = this.state.set;
        set.problems = problems;
        this.setState({ set });
    }

    addProblemSet() {
        this.toggleModals([this.PALETTE_CHOOSER_MODAL]);
    }

    progressToAddingProblems(palettes) {
        if (palettes.length == 0) {
            createAlert('warning', Locales.strings.no_palettes_chosen_warning, Locales.strings.warning);
            return;
        }
        this.setState({ tempPalettes: palettes });
        this.toggleModals([this.PALETTE_CHOOSER_MODAL, this.ADD_PROBLEM_SET_MODAL]);
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
        this.toggleModals([this.ADD_PROBLEM_SET_MODAL, this.SHARE_NEW_SET_MODAL]);
    }

    finishEditing() {
        this.props.history.push(`/problemSet/view/${this.state.set.sharecode}`);
    }

    render() {
        return (
            <div className={home.mainWrapper}>
                <NotificationContainer />
                <MainPageHeader editing={this.props.match.params.action == 'edit'} history={this.props.history} shareCallback={this.toggleModal}
                    addProblemSetCallback={this.addProblemSet} finishEditing={this.finishEditing} editCode={this.state.set.editCode}/>
                <ModalContainer activeModals={this.state.activeModals} toggleModals={this.toggleModals}
                    progressToAddingProblems={this.progressToAddingProblems} deleteProblem={this.deleteProblem}
                    shareLink={config.serverUrl + '/problemSet/view/' + this.state.set.sharecode}
                    newSetShareLink={config.serverUrl + '/problemSet/view/' + this.state.newSetSharecode}
                    activateMathField={theActiveMathField => this.setState({ theActiveMathField })}
                    theActiveMathField={this.state.theActiveMathField}
                    addProblemCallback={this.addProblem}
                    problems={this.state.set.problems}
                    tempProblems={this.state.tempProblems}
                    saveProblemSet={this.saveProblemSet}
                    saveProblems={this.saveProblems} />
                <div className={home.contentWrapper} id="ContentWrapper">
                    <nav id="LeftNavigation" className={home.leftNavigation} aria-labelledby="LeftNavigationHeader">
                        <NavigationHeader />
                        <NavigationProblems problems={this.state.set.problems} editing={this.props.match.params.action == 'edit'}
                            activateModals={this.toggleModals} deleteCallback={this.toggleModal} updatePositions={this.updatePositions} />
                    </nav>
                </div>
                <MainPageFooter />
            </div>
        )
    }
}
