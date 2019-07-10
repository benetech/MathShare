import React from 'react';
// import FontAwesome from 'react-fontawesome';
import footer from './styles.scss';
import footerLogo from '../../../../../images/footer_logo.png';
// import Locales from '../../../../strings';

const SiteMapFooter = ({ customClass }) => (
    <div className={`${footer.footer} ${customClass || ''}`}>
        <div className={`${footer.footerContainer} d-flex flex-row flex-wrap`}>
            <div>
                <div className="d-flex flex-row">
                    <img src={footerLogo} alt="footer-logo" />
                    <div className={footer.mAuto}>Mathshare is a Benetech Initiative</div>
                </div>
                <div>Our mission is to make math accessibility free and open to all students.</div>
            </div>
            <div className={`d-flex flex-row ${footer.lists}`}>
                <div>
                    <div className={footer.listTitle}>Resources</div>
                    <ul>
                        <li>
                            <a
                                href="https://drive.google.com/drive/folders/1wi19Sx20WOMo3nChzHbh8KwlIdvSs9gp?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Workshop Materials
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://intercom.help/benetech/en/collections/1820806-accessibility"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Accessibility
                            </a>
                        </li>
                        <li>
                            <a
                                href="/#/partners"
                            >
                                Partners
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSeDijluYj0wyTz6OexPppVt9enX1QXpXSMPUflkdCtTBtv6HA/viewform?usp=sf_link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Contact Us
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <div className={footer.listTitle}>Connect</div>
                    <ul>
                        <li>
                            <a
                                href="https://www.youtube.com/channel/UCfgAVftyG4bdAepSzgZvTrQ"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                YouTube
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://twitter.com/MathShare"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Twitter
                            </a>
                        </li>
                        <li>
                            <a
                                href="mailto:mattn@benetech.org"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Email
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <div className={footer.listTitle}>Connect</div>
                    <ul>
                        <li>
                            <a
                                href="/#/privacy"
                                rel="noopener noreferrer"
                            >
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a
                                href="/#/privacy"
                                rel="noopener noreferrer"
                            >
                                FERPA/COPPA
                            </a>
                        </li>
                        <li>
                            <a
                                href="/#/privacy"
                                rel="noopener noreferrer"
                            >
                                Terms of Service
                            </a>
                        </li>
                        <li>
                            <a
                                href="/#/partners"
                                rel="noopener noreferrer"
                            >
                                Open Source
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

export default SiteMapFooter;
