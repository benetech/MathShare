import React from 'react';
import { connect } from 'react-redux';
import { LiveAnnouncer, LiveMessage } from 'react-aria-live';

const AriaLiveAnnouncer = ({ ariaLiveAnnouncer }) => (
    <LiveAnnouncer>
        <LiveMessage message={ariaLiveAnnouncer.message} aria-live={ariaLiveAnnouncer.mode || 'polite'} />
    </LiveAnnouncer>
);

export default connect(
    state => ({
        ariaLiveAnnouncer: state.ariaLiveAnnouncer,
    }),
    {},
)(AriaLiveAnnouncer);
