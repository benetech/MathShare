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
                aria-label="to mathshare twitter"
            >
                <FontAwesome
                    size="lg"
                    name="twitter"
                />
            </a>
            <a
                href="https://www.youtube.com/channel/UCfgAVftyG4bdAepSzgZvTrQ "
                target="_blank"
                rel="noopener noreferrer"
                className={footer.socialIcon}
                aria-label="to mathshare youtube"
            >
                <FontAwesome
                    size="lg"
                    name="youtube-play"
                />
            </a>
            <div>{Locales.strings.copyright}</div>
        </div>
    </div>
);

export default SocialFooter;
