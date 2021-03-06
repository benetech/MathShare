import React from 'react';
import footer from './styles.scss';
import Locales from '../../../../strings';

// import benetechLogoTransparent from '../../../../../images/benetech-logo-transparent.gif';
import ideaLogo from '../../../../../images/ideas-that-work-logo.svg';

const MainPageFooter = ({ customClass }) => (
    <div className={`${footer.footer} ${customClass || ''}`}>
        <div className={footer.footerContainer}>
            <div>
                <div className={footer.edGov}>
                    <a href="https://www2.ed.gov/about/offices/list/osers/osep/index.html" target="_blank" rel="noopener noreferrer">
                        <img
                            className={footer.edGovImg}
                            src={ideaLogo}
                            alt={Locales.strings.idea_logo_alt}
                            height="50"
                        />
                        <span className="sROnly">
                            {'\u00A0'}
                            {Locales.strings.opens_in_new_tab}
                        </span>
                    </a>
                </div>
                <div className={footer.footerText}>
                    {Locales.strings.the}
                    {' '}
                    <a href="http://diagramcenter.org/" target="_blank" rel="noopener noreferrer">
                        {Locales.strings.diagram_center}
                        <span className="sROnly">
                            {'\u00A0'}
                            {Locales.strings.opens_in_new_tab}
                        </span>
                    </a>
                    {Locales.strings.is_a}
                    <a
                        href="http://www.benetech.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {Locales.strings.benetech}
                        <span className="sROnly">
                            {'\u00A0'}
                            {Locales.strings.opens_in_new_tab}
                        </span>
                    </a>
                    {Locales.strings.footer_description}
                </div>
            </div>
            {/* <div className={footer.benetech}>
                <a href="https://www.benetech.org/" target="_blank" rel="noopener noreferrer">
                    <img
                        className={footer.benetechImg}
                        src={benetechLogoTransparent}
                        alt="Benetech Logo"
                        height="50"
                    />
                    <span className="sROnly">
                        {'\u00A0'}
                        {Locales.strings.opens_in_new_tab}
                    </span>
                </a>
            </div> */}

        </div>
    </div>
);

export default MainPageFooter;
