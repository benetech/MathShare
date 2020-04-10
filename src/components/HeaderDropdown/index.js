
import React from 'react';
// import { IntercomAPI } from 'react-intercom';
import FontAwesome from 'react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';
import { passEventForKeys } from '../../services/events';
import googleAnalytics from '../../scripts/googleAnalytics';
import Locales from '../../strings';
import CommonDropdown from '../CommonDropdown';
import styles from './styles.scss';

const questionBtnId = 'navbarDropdownMenuLink-dropdown';

const clickedHelpCenter = () => {
    googleAnalytics('click help center');
};

const clickedFeedback = () => {
    googleAnalytics('click feedback');
};

const clickOnQuestion = () => {
    googleAnalytics('clicked help center');
    // IntercomAPI('trackEvent', 'clicked-help-center');
};

const HeaderDropdown = ({
    additionalClass, children, dropdownName, dropdownIcon,
}) => (
    <React.Fragment>
        <CommonDropdown
            btnId={questionBtnId}
            btnClass={`nav-link ${additionalClass}`}
            btnClickHandler={clickOnQuestion}
            containerClass={`nav-item ${styles.dropdownContainer}`}
            containerTag="li"
            btnContent={(

                <span className="sROnly">{dropdownName}</span>
            )}
            btnIcon={dropdownIcon}
            listClass="dropdown-menu-lg-right dropdown-secondary"
        >
            {children}
            <a
                key="accessibility"
                className="dropdown-item"
                href="https://docs.google.com/document/d/1vYi8n9hvhBzdRayOC-grRn4j8KnFM7RB9R2aM77tjDc/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FontAwesome
                    className="super-crazy-colors"
                    name="universal-access"
                    style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                />
                {'\u00A0'}
                {Locales.strings.accessibility}
                <span className="sROnly">
                    {'\u00A0'}
                    {Locales.strings.opens_in_new_tab}
                </span>
            </a>
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
        </CommonDropdown>
        <UncontrolledTooltip placement="top" target={questionBtnId} />
    </React.Fragment>
);

export default HeaderDropdown;
