import React, { Component } from "react";
import AriaModal from "react-aria-modal";
import Locales from '../../../../strings';
import styles from './styles.css';
import MyWork from '../../../Editor/components/MyWork';
import FontAwesome from "react-fontawesome";
import showImage from "../../../../scripts/showImage";
import Button from "../../../../components/Button";
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

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

    onImgClick(img) {
        showImage(img);
    }

    render() {
        let problems = this.props.problems.map((problem, i) => {
            const img = problem.scratchpad ?
                <div className={styles.image}>
                    <FontAwesome
                        size="2x"
                        className='super-crazy-colors'
                        name="image"
                        onClick={() => this.onImgClick(problem.scratchpad)}
                    />
                </div> : null;

            return <div className={styles.row} key={i} >
                <div className={styles.ordinal}>
                    {i + 1}.
                </div>
                <div className={styles.cell}>
                    {'$$' + problem.text + '$$'}
                </div>
                <div className={styles.cell}>
                    {problem.title}
                    {img}
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
                        editing={false}
                        history={[]}
                        solution={this.props.solution}
                        addingProblem />
                    <div ref={el => { this.el = el; }} className={styles.footer}>

                        <Button
                            className={bootstrap.btn}
                            additionalStyles={['withRightMargin', 'default', 'right']}
                            icon="save"
                            content={Locales.strings.save}
                            onClick={this.props.saveCallback}
                        />
                        <Button
                            className={bootstrap.btn}
                            additionalStyles={['withRightMargin', 'default', 'right']}
                            content={Locales.strings.cancel}
                            icon="times-circle"
                            onClick={this.props.cancelCallback}
                        />
                    </div>
                </div>
            </AriaModal>
        );
    }
}