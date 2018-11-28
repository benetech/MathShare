import React from 'react';
import MathButtonsRow from './components/MathButtonsRow';
import buttonsGroup from './styles.css';

const MathButtonsGroup = (props) => {
    const label = props.showLabel
        ? (
            <li className={buttonsGroup.label} aria-hidden="true">
                {props.palette.label}
            </li>
        )
        : null;
    const rows = props.palette.buttonsRows.map((buttonsRow, i) => (
        <span key={i} className={buttonsGroup.row}>
            <MathButtonsRow
                {...props}
                buttonsRow={buttonsRow}
            />
        </span>
    ));
    const headingId = `heading-${props.order}`;
    return (
        <ul className={props.order} aria-labelledby={headingId}>
            <span className="sROnly" id={headingId}>{props.palette.label}</span>
            {rows}
            {label}
        </ul>
    );
};

export default MathButtonsGroup;
