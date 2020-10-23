
import React from 'react';
import classNames from 'classnames';
import editorButtons from './styles.scss';
import MyWorkFooter from './components/MyWorkFooter';
import InputContainerSelectors from './components/InputContainerSelectors';
import Locales from '../../../../../../strings';

const MyWorkEditorButtons = (props) => {
    const addLabel = props.addingProblem ? Locales.strings.add_problem
        : Locales.strings.add_step;

    return (
        <div
            id="editorButtons"
            className={classNames(
                'd-flex',
                'flex-row',
                'flex-nowrap',
                'justify-content-between',
                editorButtons.editorButtons,
            )
            }
        >
            <InputContainerSelectors {...props} />
            <MyWorkFooter {...props} addLabel={addLabel} />
        </div>
    );
};

export default MyWorkEditorButtons;
