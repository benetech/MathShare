import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { setDropdownId } from '../../redux/ui/actions';
import { stopEvent, passEventForKeys } from '../../services/events';

class CommonDropdown extends Component {
    dropdownOnClick = dropdownBtnId => (e) => {
        stopEvent(e);
        const { btnClickHandler, ui } = this.props;
        const { dropdownOpen } = ui;
        if (dropdownOpen === dropdownBtnId) {
            this.props.setDropdownId(null);
        } else {
            this.props.setDropdownId(dropdownBtnId);
            if (btnClickHandler) {
                btnClickHandler();
            }
        }
    }

    render() {
        const { props } = this;
        const {
            ui, children, containerClass, btnContent, btnClass,
            btnIcon, btnIconSize, btnId, listClass, containerTag,
        } = props;
        const {
            dropdownOpen,
        } = ui;
        const dropdownIsOpen = dropdownOpen === btnId;
        const showClass = `${dropdownIsOpen ? 'show' : ''}`;
        const ContainerTag = containerTag;
        return (
            <ContainerTag className={`dropdown ${showClass} ${containerClass}`}>
                <button
                    className={`btn dropdown-toggle ${btnClass}`}
                    type="button"
                    id={btnId}
                    aria-expanded={dropdownIsOpen ? 'true' : 'false'}
                    onClick={this.dropdownOnClick(btnId)}
                    onKeyPress={passEventForKeys(undefined, undefined, true)}
                >
                    {btnIcon && (
                        <FontAwesome
                            size={btnIconSize}
                            name={btnIcon}
                        />
                    )}
                    {btnContent}
                </button>
                <ul className={`dropdown-menu ${showClass} ${listClass}`} aria-labelledby={btnId}>
                    {((children.map && children) || (children.props.children) || [])
                        .map((child, index) => (
                            <li key={child.key || `dropdown-item-${index}`}>
                                {child}
                            </li>
                        ))}
                </ul>
            </ContainerTag>
        );
    }
}

CommonDropdown.defaultProps = {
    containerTag: 'div',
};

export default connect(
    state => ({
        ui: state.ui,
    }),
    {
        setDropdownId,
    },
)(CommonDropdown);
