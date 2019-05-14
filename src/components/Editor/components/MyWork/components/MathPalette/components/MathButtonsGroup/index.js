import React from 'react';
import MathButtonsRow from './components/MathButtonsRow';
import buttonsGroup from './styles.scss';

const MathButtonsGroup = (props) => {
    const label = props.showLabel
        ? (
            <span role="listitem" className={buttonsGroup.label} aria-hidden="true">
                {props.palette.label}
            </span>
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
        <div>
            <span className="sROnly" id={headingId}>{props.palette.label}</span>
            <div role="list" className={props.order} aria-labelledby={headingId}>
                {rows}
                {label}
            </div>
        </div>
    );
};

export default MathButtonsGroup;
