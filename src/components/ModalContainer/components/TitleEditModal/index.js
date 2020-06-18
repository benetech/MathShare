import React, { Component } from 'react';
import AriaModal from 'react-aria-modal';
import classNames from 'classnames';
import editor from './styles.scss';
import Locales from '../../../../strings';
import Button from '../../../Button';

export default class TitleEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
        };
    }

    updateTitle = (e) => {
        this.setState({
            title: e.target.value,
        });
    }

    commitTitle = () => {
        this.props.updateProblemSetTitle(this.state.title);
        this.props.deactivateModal();
    }

    render() {
        return (
            <AriaModal
                titleId="titleEditModalHeader"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
            >
                <div id="titleEditModal" className={editor.modal}>
                    <div className={editor.modalBody}>
                        <h1 id="titleEditModalHeader">
                            {Locales.strings.update_title}
                        </h1>
                        <input
                            type="text"
                            value={this.state.title}
                            id="editTitle"
                            className={editor.editTitle}
                            onChange={this.updateTitle}
                        />
                    </div>
                    <div className={editor.modalFooter}>
                        <Button
                            id="save_title"
                            className={classNames('btn', 'btn-primary', editor.button)}
                            ariaHidden="false"
                            type="button"
                            icon="save"
                            content={Locales.strings.save}
                            onClick={this.commitTitle}
                        />
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
