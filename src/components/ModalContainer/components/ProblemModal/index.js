import React, { Component } from 'react';
import AriaModal from 'react-aria-modal';
import classNames from 'classnames';
import editor from './styles.scss';
import Locales from '../../../../strings';
import Button from '../../../Button';

const mathLive = process.env.MATHLIVE_DEBUG_MODE ? require('../../../../../../mathlive/src/mathlive.js').default
    : require('../../../../../src/lib/mathlivedist/mathlive.js');

export default class ProblemModal extends Component {
    componentDidMount() {
        mathLive.renderMathInDocument();
    }

    copyShareLink = () => {
        const copyText = document.getElementById('shareLink');
        copyText.select();
        document.execCommand('copy');
    }

    render() {
        return (
            <AriaModal
                titleId="problemModalHeader"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
            >
                <div id="problemModal" className={`mathliveModal ${editor.modal}`}>
                    <div className={editor.modalBody}>
                        <h1 id="problemModalHeader">
                            {this.props.solution.problem.title}
                        </h1>
                        <div className={editor.desc}>{`$$${this.props.solution.problem.text}$$`}</div>
                    </div>
                    <div className={editor.modalFooter}>
                        <Button
                            id="deactivate"
                            className={classNames('btn', 'btn-primary')}
                            ariaHidden="false"
                            type="button"
                            icon="times"
                            content={Locales.strings.close}
                            onClick={this.props.deactivateModal}
                        />
                    </div>
                </div>
            </AriaModal>
        );
    }
}
