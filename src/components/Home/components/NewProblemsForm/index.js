import React, { Component } from "react";
import AriaModal from "react-aria-modal";
import Locales from '../../../../strings'
import styles from './styles.css';
import MyWork from '../../../Editor/components/MyWork'

const mathLive = DEBUG_MODE ? require('../../../../../mathlive/src/mathlive.js')
    : require('../../../../lib/mathlivedist/mathlive.js');

export default class NewProblemsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        mathLive.renderMathInDocument();
    }

    getApplicationNode() {
        return document.getElementById('root');
    };

    render() {
        let problems = this.props.problems.map( (problem, i) => {
            return <div className={styles.row}>
                <div className={styles.ordinal}>
                        {i}.
                </div>
                <div className={styles.cell}>
                    {'$$' + problem.text + '$$'}
                </div>
                <div className={styles.cell}>
                    {problem.title}
                </div>
            </div>
        });
        return (
            <AriaModal
                id="modal"
                titleText="demo one"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
            >
                <div className={styles.container} id="container">
                    <div className={styles.header}>
                        <h5 className={styles.ordinal}>
                            {Locales.strings.hash}
                        </h5>
                        <h5 className={styles.cell}>
                            {Locales.strings.equation}
                        </h5>
                        <h5 className={styles.cell}>
                            {Locales.strings.annotation}
                        </h5>
                    </div>                
                    {problems}
                    <MyWork
                        key={"editor"}
                        allowedPalettes={this.props.allowedPalettes}
                        activateMathField={this.props.activateMathField}
                        theActiveMathField={this.props.theActiveMathField}
                        textAreaChanged={this.props.textAreaChanged}
                        textAreaValue={this.props.textAreaValue}
                        addStepCallback={this.props.addProblemCallback}
                        cancelCallback={this.props.cancelCallback}
                        saveCallback={this.props.saveCallback}
                        editing={false}
                        history={[]}
                        solution={this.props.solution}
                        addingProblem={true} />
                    <div ref={el => { this.el = el; }} style={{height: 50}}/>
                </div>
            </AriaModal>
        );
    }
}