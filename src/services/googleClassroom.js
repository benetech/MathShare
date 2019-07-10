export const renderShareToClassroom = (id, urlPath, additionalParams) => {
    if (typeof (window) !== 'undefined' && window.gapi && window.gapi.sharetoclassroom) {
        window.gapi.sharetoclassroom.render(id, {
            url: `${window.location.origin}${urlPath}`,
            ...additionalParams,
        });
        setTimeout(() => {
            const container = document.getElementById(id);
            if (container) {
                const iframes = container.getElementsByTagName('iframe');
                if (iframes && iframes.length > 0) {
                    iframes[0].tabIndex = -1;
                }
            }
        }, 200);
    }
};

export default {
    renderShareToClassroom,
};
