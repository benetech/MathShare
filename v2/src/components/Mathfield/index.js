import * as React from 'react';
import Mathlive from 'mathlive';
// import 'mathlive/dist/mathlive-fonts.css';

export function combineConfig(props) {
    const combinedConfiguration = {
        ...props.mathfieldConfig,
    };

    const { onChange } = props;

    if (onChange) {
        if (props.mathfieldConfig && props.mathfieldConfig.onContentDidChange) {
            const fromConfig = props.mathfieldConfig.onContentDidChange;
            combinedConfiguration.onContentDidChange = (mf) => {
                onChange(mf.$latex());
                fromConfig(mf);
            };
        } else {
            combinedConfiguration.onContentDidChange = mf => onChange(mf.$latex());
        }
    }

    return combinedConfiguration;
}

/** A react-control that hosts a mathlive-mathfield in it. */
export class MathfieldComponent extends React.Component {
    insertElement = null;

    combinedConfiguration = combineConfig(this.props);

    mathfield;

    componentDidMount() {
        if (!this.insertElement) {
            throw new Error(
                'React did apparently not mount the insert point correctly.',
            );
        }

        const initialValue = this.props.initialLatex ?? this.props.latex;

        this.mathfield = Mathlive.makeMathField(
            this.insertElement,
            this.combinedConfiguration,
        );
        this.mathfield.$latex(initialValue, {
            suppressChangeNotifications: true,
        });

        if (this.props.mathfieldRef) {
            this.props.mathfieldRef(this.mathfield);
        }
    }

    componentDidUpdate(prevProps) {
        if (!this.mathfield) {
            throw new Error('Component was not correctly initialized.');
        }
        if (prevProps.latex !== undefined) {
            if (this.props.latex === undefined) {
                throw new Error(
                    'Cannot change from controlled to uncontrolled state!',
                );
            }
            if (this.props.latex !== prevProps.latex) {
                if (this.props.latex === '') {
                    this.mathfield.$perform('deleteAll');
                } else {
                    this.mathfield.$latex(this.props.latex, {
                        suppressChangeNotifications: true,
                        readOnly: true,
                        horizontalSpacingScale: 2,
                    });
                }
            }
        }
    }

    render() {
        return <div ref={(instance) => { this.insertElement = instance; }} />;
    }
}
