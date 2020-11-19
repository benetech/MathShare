/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */

import { faCopy, faEllipsisH, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button, Dropdown, Menu,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MathfieldComponent } from 'react-mathlive';
import { stopEvent } from '../../services/events';
import problemActions from '../../redux/problem/actions';
import styles from './styles.scss';

class Step extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            explanationFocused: false,
            latex: '',
        };
    }

    scrollToTargetAdjusted = () => {
        this.stepContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    handleFocus = () => {
        this.mathfieldRef.mathfield.focus();
    }

    handleTab = (sender, direction) => {
        if (direction === 'forward') {
            if (this.textAreaRef) {
                this.textAreaRef.focus();
            }
        } else if (direction === 'backward') {
            const focussableElements = 'a:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
            const referenceElement = this.placeholderInput;
            if (referenceElement) {
                const focussable = Array.prototype.filter.call(
                    document.querySelectorAll(focussableElements),
                    element => element.offsetWidth > 0
                        || element.offsetHeight > 0
                        || element === referenceElement,
                );
                const index = focussable.indexOf(referenceElement);
                if (index > -1) {
                    const nextElement = focussable[index - 1] || focussable[0];
                    if (nextElement) {
                        nextElement.focus();
                    }
                }
            }
        }
        this.setState({ focused: false });
    }

    renderMathField = () => {
        const { stepValue, index } = this.props;
        const { focused, latex } = this.state;
        return (
            <>
                <input
                    ref={(ref) => { this.placeholderInput = ref; }}
                    value={(stepValue || latex || focused) ? '' : 'Start solving here'}
                    onFocus={this.handleFocus}
                    // onBlur={() => this.setState({ focused: false })}
                    readOnly
                />
                <MathfieldComponent
                    latex={stepValue || ''}
                    ref={(ref) => { this.mathfieldRef = ref; }}
                    mathfieldConfig={{
                        virtualKeyboardMode: 'onfocus',
                        smartMode: true,
                        onTabOutOf: this.handleTab,
                        onBlur: () => this.setState({ focused: false }),
                        onFocus: () => {
                            this.props.setCurrentStep(index);
                            this.setState({ focused: true });
                            setTimeout(this.scrollToTargetAdjusted, 300);
                        },
                        onVirtualKeyboardToggle: (_sender, visible) => {
                            this.props.markKeyboardVisible(visible);
                        },
                        onContentDidChange: (mf) => {
                            const latexValue = mf.getValue();
                            this.setState({
                                latex: latexValue,
                            });
                            this.props.updateStepMath(index, latexValue);
                        },
                    }}
                />
            </>
        );
    }

    render() {
        const { index, explanation } = this.props;
        const { explanationFocused, focused } = this.state;

        const menu = (
            <Menu
                className={styles.menu}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                onClick={e => stopEvent(e.domEvent)}
            >
                <Menu.Item onClick={e => stopEvent(e)}>
                    <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faCopy} />}
                        onClick={() => { this.props.duplicateStep(index); }}
                    >
                        Duplicate
                    </Button>
                </Menu.Item>
                <Menu.Item onClick={e => stopEvent(e)}>
                    <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faMinusCircle} />}
                        onClick={() => { this.props.deleteStep(index); }}
                    >
                        Delete
                    </Button>
                </Menu.Item>
            </Menu>
        );

        return (
            <div className={styles.step} ref={(ref) => { this.stepContainer = ref; }}>
                <div className={styles.stepHeading}>
                    <span>
                        Step
                        {' '}
                        {index + 1}
                    </span>
                    <Dropdown
                        overlay={menu}
                        placement="bottomRight"
                        className={styles.icon}
                        overlayClassName={styles.dropdown}
                        trigger={['click']}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                        <Button type="text" size="large" icon={<FontAwesomeIcon icon={faEllipsisH} />} onClick={e => e.preventDefault()} />
                    </Dropdown>
                </div>
                <div className={`${styles.stepBody} ${(explanationFocused || focused) ? styles.containerFocused : ''}`}>
                    <div className={styles.mathContainer}>
                        <span role="img" aria-label="pencil emoji">✏️</span>
                        {this.renderMathField()}
                    </div>
                    <div className={styles.explanationContainer}>
                        <span className={styles.icon} role="img" aria-label="speech bubble emoji">💬</span>
                        <textarea
                            className={styles.explanation}
                            placeholder="Add your explanation here"
                            value={explanation}
                            rows="1"
                            onBlur={() => this.setState({ explanationFocused: false })}
                            onFocus={() => {
                                this.setState({ explanationFocused: true });
                                this.props.setCurrentStep(index);
                            }}
                            onChange={e => this.props.updateStepExplanation(index, e.target.value)}
                            ref={(ref) => { this.textAreaRef = ref; }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    () => ({}),
    {
        ...problemActions,
    },
)(Step);
