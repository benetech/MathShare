import ReactGA from 'react-ga';

export default function GoogleAnalytics(action) {
    ReactGA.ga('send', {
        hitType: 'event',
        eventCategory: 'Editor',
        eventAction: action,
        eventLabel: ''
    });
}
