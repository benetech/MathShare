import React from 'react';
import MathButtonsRow from './components/MathButtonsRow';
import buttonsGroup from './styles.css';

const MathButtonsGroup = (props) => {
    const label = props.showLabel ? <span className={buttonsGroup.label} role="listitem">{props.palette.label}</span> : null;
    const rows = props.palette.buttonsRows.map((buttonsRow, i) => (
        <div key={i} role="list" className={buttonsGroup.row}>
            <MathButtonsRow
                {...props}
                buttonsRow={buttonsRow}
            />
        </div>
    ));
    return (
        <div className={props.order}>
            {rows}
            {label}
        </div>
    );
};

export default MathButtonsGroup;
