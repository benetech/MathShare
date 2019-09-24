import React from 'react';
// import FontAwesome from 'react-fontawesome';
import footer from './styles.scss';
import footerLogo from '../../../../../images/footer_logo.png';
import Locales from '../../../../strings';

const SiteMapFooter = ({ customClass }) => (
    <div className={`${footer.footer} ${customClass || ''}`}>
        <div className={`${footer.footerContainer} d-flex flex-row flex-wrap`}>
            <div>
                <div className="d-flex flex-row">
                    <img src={footerLogo} alt="benetech logo" />
                    <div className={footer.mAuto}>
                        <p>{Locales.strings.mathshare_is_a}</p>
                        <p>{Locales.strings.benetech_initiative}</p>
                    </div>
                </div>
                <div className={footer.footerLine}>
                    {Locales.strings.mission}
                </div>
            </div>
            <div className={`d-flex flex-row ${footer.lists}`}>
                <div>
                    <h3 id="listTitle__resources" className={footer.listTitle}>{Locales.strings.resources}</h3>
                    <ul aria-labelledby="listTitle__resources">
                        <li>
                            <a
                                href="https://drive.google.com/drive/folders/1wi19Sx20WOMo3nChzHbh8KwlIdvSs9gp?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {Locales.strings.workshop_materials}
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://intercom.help/benetech/en/collections/1820806-accessibility"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {Locales.strings.accessibility}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/#/partners"
                            >
                                {Locales.strings.partners}
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSeDijluYj0wyTz6OexPppVt9enX1QXpXSMPUflkdCtTBtv6HA/viewform?usp=sf_link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {Locales.strings.contact_us.trim()}
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 id="listTitle__connect" className={footer.listTitle}>{Locales.strings.connect}</h3>
                    <ul>
                        <li>
                            <a
                                href="https://www.youtube.com/channel/UCfgAVftyG4bdAepSzgZvTrQ"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {Locales.strings.youtube}
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://twitter.com/MathShare"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {Locales.strings.twitter}
                            </a>
                        </li>
                        <li>
                            <a
                                href="mailto:mattn@benetech.org"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {Locales.strings.email}
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 id="listTitle__info" className={footer.listTitle}>{Locales.strings.info}</h3>
                    <ul aria-labelledby="listTitle__info">
                        <li>
                            <a
                                href="/#/privacy"
                                rel="noopener noreferrer"
                            >
                                {Locales.strings.privacy_policy}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/#/privacy"
                                rel="noopener noreferrer"
                            >
                                {Locales.strings.ferpa_coppa}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/#/privacy"
                                rel="noopener noreferrer"
                            >
                                {Locales.strings.tos}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/#/partners"
                                rel="noopener noreferrer"
                            >
                                {Locales.strings.open_source}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

export default SiteMapFooter;
