
import React from 'react';
import { IntercomAPI } from 'react-intercom';
import FontAwesome from 'react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';
import { passEventForKeys } from '../../services/events';
import googleAnalytics from '../../scripts/googleAnalytics';
import Locales from '../../strings';

const questionBtnId = 'navbarDropdownMenuLink-dropdown';

const clickedHelpCenter = () => {
    googleAnalytics('click help center');
};

const clickedFeedback = () => {
    googleAnalytics('click feedback');
};

const clickOnQuestion = () => {
    googleAnalytics('clicked help center');
    IntercomAPI('trackEvent', 'clicked-help-center');
};

const HeaderDropdown = ({
    additionalClass, children, dropdownName, dropdownIcon,
}) => (
    <li className="nav-item dropdown">
        <button
            className={`nav-link dropdown-toggle btn ${additionalClass}`}
            id={questionBtnId}
            data-toggle="dropdown"
            type="button"
            onClick={clickOnQuestion}
            onKeyPress={passEventForKeys(clickOnQuestion)}
            aria-expanded="false"
        >
            <FontAwesome
                size="lg"
                name={dropdownIcon}
            />
            <span className="sROnly">{dropdownName}</span>
        </button>
        <UncontrolledTooltip placement="top" target={questionBtnId} />
        <ul
            className="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
            aria-labelledby={questionBtnId}
        >
            {children.filter(child => child).map((child, index) => (
                <li key={child.key || `dropdown-item-${index}`}>
                    {child}
                </li>
            ))}
            <li>
                <a
                    className="dropdown-item"
                    href="https://intercom.help/benetech/en"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={clickedHelpCenter}
                    onKeyPress={passEventForKeys(clickedHelpCenter)}
                >
                    <FontAwesome
                        className="super-crazy-colors"
                        name="comment"
                        style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                    />
                    {Locales.strings.help_center}
                    <span className="sROnly">
                        {'\u00A0'}
                        {Locales.strings.opens_in_new_tab}
                    </span>
                </a>
            </li>
            <li>
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLScSZJo47vQM_5ci2MOgBbJW7WM6FbEi2xABR5qSZd8oD2RZEg/viewform?usp=sf_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dropdown-item"
                    onClick={clickedFeedback}
                    onKeyPress={passEventForKeys(clickedFeedback)}
                >
                    <FontAwesome
                        className="super-crazy-colors"
                        name="arrow-circle-right"
                        style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                    />
                    {Locales.strings.provide_feedback}
                    <span className="sROnly">
                        {'\u00A0'}
                        {Locales.strings.opens_in_new_tab}
                    </span>
                </a>
            </li>
        </ul>
    </li>
);

export default HeaderDropdown;
