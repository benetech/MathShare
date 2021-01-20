import React from 'react';
import classNames from 'classnames';
import { IntercomAPI } from 'react-intercom';
import { Button, Modal, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faShare, faTimes } from '@fortawesome/free-solid-svg-icons';

import editor from './styles.scss';
import Locales from '../../../strings';
import { passEventForKeys } from '../../../services/events';
import msTeamIcon from '../../../../../images/ms-team-icon.svg';
// import googleAnalytics from '../../scripts/googleAnalytics';
import CopyLink from '../../CopyLink';
// import Modal from 'antd/lib/modal/Modal';

export default class ProblemSetShareModal extends React.Component {
    // componentWillMount() {
    //     const { isSolutionSet, shareLink } = this.props;
    //     if (!isSolutionSet && shareLink) {
    //         googleAnalytics(Locales.strings.share_problem_set);
    //     }
    // }

    copyLinkCallback = () => {
        IntercomAPI('trackEvent', 'assigned-a-set');
        IntercomAPI('trackEvent', 'assign-a-set-link');
    }

    shareOnGoogleClassroom = (e) => {
        const {
            problemList,
            shareLink,
        } = this.props;
        const { action } = this.getParams();
        e.preventDefault();
        const popupConfig = 'height=400,width=641,top=100,left=100,target=classroomPopup,toolbar=yes,scrollbars=yes,menubar=yes,location=no,resizable=yes';
        if (action === 'edit') {
            window.open(
                `https://classroom.google.com/u/0/share?url=${encodeURIComponent(shareLink)}&title=${problemList.set.title}`,
                'googleClassroom',
                popupConfig,
            );
            IntercomAPI('trackEvent', 'assign-a-set-google-classroom');
            IntercomAPI('trackEvent', 'assigned-a-set');
        } else if (action === 'view' || action === 'solve') {
            window.open(
                `https://classroom.google.com/u/0/share?url=${encodeURIComponent(shareLink)}`,
                'googleClassroom',
                popupConfig,
            );
            IntercomAPI('trackEvent', 'submit-problem-set-google-classroom');
        }
        this.props.deactivateModal();
    }

    shareOnMicrosoftTeams = () => {
        const { shareLink } = this.props;
        const { action } = this.getParams();
        const popupConfig = 'height=578,width=700,top=100,left=100,target=msTeamPopup,toolbar=yes,scrollbars=yes,menubar=yes,location=no,resizable=yes';
        window.open(
            `https://teams.microsoft.com/share?href=${encodeURIComponent(shareLink)}&preview=true&referrer=${window.location.hostname}`,
            'microsoftTeam',
            popupConfig,
        );
        if (action === 'edit') {
            IntercomAPI('trackEvent', 'assign-a-set-microsoft-team');
            IntercomAPI('trackEvent', 'assigned-a-set');
        } else if (action === 'view' || action === 'solve') {
            IntercomAPI('trackEvent', 'submit-problem-set-microsoft-team');
        }
        this.props.deactivateModal();
    }

    getParams = () => {
        const path = window.location.hash.substr(1);
        const params = path.split('/app/problemSet/')[1].split('/');
        return {
            action: params[0],
            code: params[1],
        };
    }

    render() {
        const { isSolutionSet, problemList } = this.props;
        const currentSet = problemList.set;
        let message = '';
        let header = '';
        let iconName = null;
        let messageList = [];
        if (isSolutionSet) {
            message = Locales.strings.submit_your_answers;
            header = Locales.strings.share_my_answers;
            iconName = faCheckCircle;
            messageList = [
                Locales.strings.allow_others_to_see,
                Locales.strings.your_work_cannot,
                Locales.strings.problem_set_cannot_be_duplicated,
            ];
        } else {
            message = Locales.strings.share_your_problem_set;
            header = Locales.strings.share_problem_set;
            iconName = faShare;
            messageList = [
                Locales.strings.allow_students_to_see,
                Locales.strings.allow_educators_to_duplicate,
            ];
        }
        return (
            <Modal
                {...this.props}
                title={(
                    <div className={editor.modalHeader}>
                        <FontAwesomeIcon icon={iconName} />
                        <span>
                            {' '}
                            {header}
                        </span>
                    </div>
                )}
                closable={false}
                footer={[
                    <Button
                        className={editor.modalFooter}
                        key="submit"
                        icon={<FontAwesomeIcon icon={faTimes} />}
                        type="primary"
                        aria-label="Close"
                        onClick={this.props.onCancel}
                    >
                        {' Close'}
                    </Button>,
                ]}
                style={{ width: '100%' }}
                className={editor.setShareModal}
            >
                <div id="ProblemSetShareModal" className={editor.modal}>
                    <div className={editor.modalBody}>
                        <ul className={editor.messageList}>
                            {messageList.map((messageListItem, mIndex) => (
                                <li key={mIndex}>{messageListItem}</li>
                            ))}
                        </ul>
                        <div className={editor.modalMessage}>
                            <p>{message}</p>
                        </div>
                        <div className="row">
                            <div className={classNames('col-12', editor.shareContainer)}>
                                <CopyLink
                                    icon="copy"
                                    injectionContainer="ProblemSetShareModal"
                                    copyText={Locales.strings.copy_link_url}
                                    announceText={Locales.strings.successfully_copied}
                                    announceOnAriaLive={this.props.announceOnAriaLive}
                                    clearAriaLive={this.props.clearAriaLive}
                                    shareLink={this.props.shareLink}
                                    copyLinkCallback={this.copyLinkCallback}
                                    className={classNames('btn', editor.button)}
                                    btnProps={{ 'aria-label': Locales.strings.copy_link_url.trim() }}
                                />
                            </div>
                            <div className={classNames('col-12', 'text-center', editor.externalButtons)}>
                                <span>
                                    <Tooltip>
                                        <button
                                            id="googleContainer1"
                                            className={classNames([
                                                'btn',
                                                'btn-outline-dark',
                                                editor.buttonContainer,
                                                'pointer',
                                            ])}
                                            onClick={this.shareOnGoogleClassroom}
                                            onKeyPress={
                                                passEventForKeys(this.shareOnGoogleClassroom)
                                            }
                                            type="button"
                                        >
                                            <img src="https://mathshare-qa.diagramcenter.org/images/google-classroom-icon.png" alt="" />
                                            <span className={editor.btnText}>
                                                <span className="sROnly">
                                                    {Locales.strings.share_on}
                                                </span>
                                                {Locales.strings.google_classroom}
                                                <span className="sROnly">
                                                    {'\u00A0'}
                                                    {Locales.strings.opens_in_new_tab}
                                                </span>
                                            </span>
                                        </button>
                                    </Tooltip>
                                </span>
                                <span>
                                    <Tooltip>
                                        <button
                                            id="microsoftTeamContainer1"
                                            className={classNames([
                                                'btn',
                                                'btn-outline-dark',
                                                editor.buttonContainer,
                                                'pointer',
                                            ])}
                                            onClick={this.shareOnMicrosoftTeams}
                                            onKeyPress={
                                                passEventForKeys(this.shareOnMicrosoftTeams)
                                            }
                                            type="button"
                                        >
                                            <img
                                                src={msTeamIcon}
                                                alt=""
                                            />
                                            <span className={editor.btnText}>
                                                <span className="sROnly">
                                                    {Locales.strings.share_on}
                                                </span>
                                                {Locales.strings.ms_team}
                                                <span className="sROnly">
                                                    {'\u00A0'}
                                                    {Locales.strings.opens_in_new_tab}
                                                </span>
                                            </span>
                                        </button>
                                    </Tooltip>
                                </span>
                                {(isSolutionSet && currentSet && currentSet.partner
                                    && currentSet.partner.canSubmit) && (
                                    <Button
                                        id="partnerBtn"
                                        className={classNames([
                                            'btn',
                                            'btn-outline-dark',
                                            editor.integrationBtn,
                                        ])}
                                        type="button"
                                        content={Locales.strings.submit_to_partner.replace('{partner}', currentSet.partner.name)}
                                        onClick={() => {
                                            this.props.submitToPartner(
                                                currentSet.id,
                                                problemList.editCode,
                                                problemList.reviewCode,
                                            );
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
