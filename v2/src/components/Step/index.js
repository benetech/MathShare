/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */

import React, { Component } from 'react';
import { MathfieldComponent } from 'react-mathlive';
import styles from './styles.scss';

class Step extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            latex: '',
        };
    }

    handleFocus = () => {
        this.mathfieldRef.mathfield.focus();
        this.placeholderInput.scrollIntoView();
    }

    handleTab = (sender, direction) => {
        if (direction === 'forward') {
            if (this.textAreaRef) {
                this.textAreaRef.focus();
            }
        } else if (direction === 'backward') {
            const focussableElements = 'a:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
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
        const { stepValue } = this.props;
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
                    initialLatex={stepValue || ''}
                    ref={(ref) => { this.mathfieldRef = ref; }}
                    mathfieldConfig={{
                        virtualKeyboardMode: 'onfocus',
                        smartMode: true,
                        onTabOutOf: this.handleTab,
                        onBlur: () => this.setState({ focused: false }),
                        onFocus: () => {
                            this.setState({ focused: true });
                            this.textAreaRef.scrollIntoView();
                        },
                        onContentDidChange: (mf) => {
                            const latexValue = mf.getValue();
                            this.setState({
                                latex: latexValue,
                            });
                        },
                    }}
                />
            </>
        );
    }

    render() {
        const { index, exaplanation } = this.props;

        return (
            <div className={styles.step}>
                <div className={styles.stepHeading}>
                    Step
                    {' '}
                    {index + 1}
                </div>
                <div className={styles.stepBody}>
                    <div className={styles.mathContainer}>
                        <span role="img" aria-label="pencil emoji">✏️</span>
                        {this.renderMathField()}
                    </div>
                    <div className={styles.explanationContainer}>
                        <span className={styles.icon} role="img" aria-label="speech bubble emoji">💬</span>
                        <textarea
                            className={styles.exaplanation}
                            placeholder="Add your explanation here"
                            value={exaplanation}
                            rows="1"
                            ref={(ref) => { this.textAreaRef = ref; }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Step;
