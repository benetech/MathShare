import React from 'react';
import FontAwesome from 'react-fontawesome';
import footer from './styles.scss';
import Locales from '../../../../strings';

const SocialFooter = ({ customClass }) => (
    <div className={`${footer.footer} ${customClass || ''}`}>
        <div className={footer.footerContainer}>
            <a
                href="https://twitter.com/MathShare"
                target="_blank"
                rel="noopener noreferrer"
                className={footer.socialIcon}
            >
                <FontAwesome
                    size="lg"
                    name="twitter"
                />
                <span className="sROnly">
                    {Locales.strings.to_mathshare_twitter}
                    {'\u00A0'}
                    {Locales.strings.opens_in_new_tab}
                </span>
            </a>
            <a
                href="https://www.youtube.com/channel/UCfgAVftyG4bdAepSzgZvTrQ "
                target="_blank"
                rel="noopener noreferrer"
                className={footer.socialIcon}
            >
                <FontAwesome
                    size="lg"
                    name="youtube-play"
                />
                <span className="sROnly">
                    {Locales.strings.to_mathshare_youtube}
                    {'\u00A0'}
                    {Locales.strings.opens_in_new_tab}
                </span>
            </a>
            <div>{Locales.strings.copyright}</div>
        </div>
    </div>
);

export default SocialFooter;
