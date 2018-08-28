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
            modalActive: false,
            shareModalActive: false,
            allowedPalettes: props.allowedPalettes,
            theActiveMathField: null,
            textAreaValue: "",
            tempProblems: []
        }
        
        this.textAreaChanged = this.textAreaChanged.bind(this);
        this.deactivateModal = this.deactivateModal.bind(this);
        this.activateModal = this.activateModal.bind(this);
        this.deactivateShareModal = this.deactivateShareModal.bind(this);
        this.activateShareModal = this.activateShareModal.bind(this);
        this.addProblem = this.addProblem.bind(this);
        this.saveProblems = this.saveProblems.bind(this);
        this.deleteProblem = this.deleteProblem.bind(this);
    }

    componentDidMount() {
        axios.get(`${config.serverUrl}/set/${this.props.match.params.action}/${this.props.match.params.code}`)
            .then(response => {
                this.setState({
                    set: {
                        problems: response.data.problems,
                        editCode: response.data.editCode,
                        sharecode: response.data.shareCode
                    }});
            });
    }

    textAreaChanged(text) {
        this.setState({textAreaValue : text});
    }

    deactivateModal() {
        this.setState({ modalActive: false });
    };

    activateModal() {
        this.setState({ modalActive: true });
    }; 

    deactivateShareModal() {
        this.setState({ shareModalActive: false });
    };

    activateShareModal() {
        this.setState({ shareModalActive: true });
    };

    addProblem() {
        if (this.state.textAreaValue === "") {
            createAlert('warning', Locales.strings.no_problem_title_warning, Locales.strings.warning);
            setTimeout(function(){
                $('#mathAnnotation').focus();
            }, 6000);
            return;
        }
        let newProblems = this.state.tempProblems;
        let mathContent = this.state.theActiveMathField.latex();
        let annotation = this.state.textAreaValue;
        newProblems.push({"text": mathContent , "title": annotation});

        
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
        document.querySelector("#container").scrollTo(0, document.querySelector("#container").scrollHeight);
    }

    saveProblems() {
        var oldSet = this.state.set;
        oldSet.problems = oldSet.problems.concat(this.state.tempProblems);
        console.log(oldSet.problems);

        axios.put(`${config.serverUrl}/set/`, oldSet)
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
        axios.put(`${config.serverUrl}/set/`, oldSet)
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

        setTimeout(function() { 
            mathLive.renderMathInDocument();
        }.bind(this), 200)
    }

    render() {
        const shareModal = this.state.shareModalActive ? 
        <ShareModal shareLink={config.serverUrl + '/set/view/' + this.state.set.sharecode} deactivateModal={this.deactivateShareModal}/>
        : null;

        const modal = this.state.modalActive
        ? <NewProblemsForm deactivateModal={this.deactivateModal}
            activateMathField={theActiveMathField => this.setState({theActiveMathField})}
            theActiveMathField={this.state.theActiveMathField}
            textAreaChanged={this.textAreaChanged}
            textAreaValue={this.state.textAreaValue}
            addProblemCallback={this.addProblem}
            problems={this.state.tempProblems}
            cancelCallback={this.deactivateModal}
            saveCallback={this.saveProblems}/>
        : null;

        return (
            <div className={home.mainWrapper}>
                <NotificationContainer />
                {shareModal}
                <MainPageHeader editing={this.props.match.params.action=='edit'} history={this.props.history} shareCallback={this.activateShareModal}/>
                <div className={home.contentWrapper} id="ContentWrapper">
                {modal}
                    <nav id="LeftNavigation" className={home.leftNavigation} aria-labelledby="LeftNavigationHeader">
                        <NavigationHeader />
                        <NavigationProblems problems={this.state.set.problems} editing={this.props.match.params.action=='edit'} activateModal={this.activateModal}
                            deleteCallback={this.deleteProblem}/>
                    </nav>
                </div>
                <MainPageFooter />
            </div>
        )
    }
}
