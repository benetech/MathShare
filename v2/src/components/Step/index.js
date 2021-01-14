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
import Locales from '../../strings';
import problemActions from '../../redux/problem/actions';
import { saveProblems, updateEditProblem } from '../../redux/problemSet/actions';
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
        const {
            stepValue, index, solvePlaceholder, isProblemSet,
        } = this.props;
        const { focused, latex } = this.state;
        return (
            <>
                <input
                    ref={(ref) => { this.placeholderInput = ref; }}
                    value={(stepValue || latex || focused) ? '' : (solvePlaceholder || 'Start solving here')}
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
                        onBlur: () => {
                            this.setState({ focused: false });
                            if (isProblemSet) {
                                this.props.saveProblems();
                            }
                        },
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
                            if (isProblemSet) {
                                this.props.updateEditProblem({
                                    text: latexValue,
                                });
                            } else {
                                this.props.updateStepMath(index, latexValue);
                            }
                        },
                    }}
                />
            </>
        );
    }

    render() {
        const {
            index,
            explanation,
            explanationPlaceholder,
            hideHeading,
            isProblemSet,
        } = this.props;
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
                        {Locales.strings.duplicate}
                    </Button>
                </Menu.Item>
                <Menu.Item onClick={e => stopEvent(e)}>
                    <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faMinusCircle} />}
                        onClick={() => { this.props.deleteStep(index); }}
                    >
                        {Locales.strings.delete}
                    </Button>
                </Menu.Item>
            </Menu>
        );

        return (
            <div className={styles.step} ref={(ref) => { this.stepContainer = ref; }}>
                {!hideHeading && (
                    <div className={styles.stepHeading}>
                        <span>
                            {Locales.strings.step}
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
                )}
                <div className={`${styles.stepBody} ${(explanationFocused || focused) ? styles.containerFocused : ''}`}>
                    <div className={styles.mathContainer}>
                        <span role="img" aria-label="pencil emoji">✏️</span>
                        {this.renderMathField()}
                    </div>
                    <div className={styles.explanationContainer}>
                        <span className={styles.icon} role="img" aria-label="speech bubble emoji">💬</span>
                        <textarea
                            className={styles.explanation}
                            placeholder={explanationPlaceholder || 'Add your explanation here'}
                            value={explanation}
                            rows="1"
                            onBlur={() => {
                                this.setState({ explanationFocused: false });
                                if (isProblemSet) {
                                    this.props.saveProblems();
                                }
                            }}
                            onFocus={() => {
                                this.setState({ explanationFocused: true });
                                this.props.setCurrentStep(index);
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (isProblemSet) {
                                    this.props.updateEditProblem({
                                        title: value,
                                    });
                                } else {
                                    this.props.updateStepExplanation(index, value);
                                }
                            }}
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
        saveProblems,
        updateEditProblem,
    },
)(Step);
