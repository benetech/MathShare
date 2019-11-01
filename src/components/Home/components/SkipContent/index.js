import React from 'react';
import Locales from '../../../../strings';
import { passEventForKeys, focusOnMainContent } from '../../../../services/events';

const SkipContent = () => (
    <a
        data-skip-link
        // eslint-disable-next-line no-script-url
        href="javascript:void(0)"
        onClick={focusOnMainContent}
        onKeyPress={passEventForKeys(focusOnMainContent)}
    >
        {Locales.strings.go_to_main_content}
    </a>
);

export default SkipContent;
