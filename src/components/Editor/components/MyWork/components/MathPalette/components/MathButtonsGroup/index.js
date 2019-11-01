import React from 'react';
import MathButtonsRow from './components/MathButtonsRow';
import buttonsGroup from './styles.scss';

const MathButtonsGroup = (props) => {
    const rows = props.palette.buttonsRows.map((buttonsRow, i) => (
        <span key={i} className={buttonsGroup.row}>
            <MathButtonsRow
                {...props}
                buttonsRow={buttonsRow}
            />
        </span>
    ));
    return (
        <div>
            <div role="list" className={props.order} aria-labelledby={props.labelId}>
                {rows}
            </div>
        </div>
    );
};

export default MathButtonsGroup;
