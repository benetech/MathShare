import React, { Component } from 'react';
import { NotificationContainer } from 'react-notifications';
import { UncontrolledTooltip } from 'reactstrap';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import { IntercomAPI } from 'react-intercom';
import MainPageHeader from './components/Header';
import NavigationHeader from './components/Navigation/Header';
import NavigationProblems from './components/Navigation/Problems';
import { TITLE_EDIT_MODAL, PALETTE_CHOOSER } from '../ModalContainer';
import NotFound from '../NotFound';
import home from './styles.scss';
import Locales from '../../strings';
import problemActions from '../../redux/problemList/actions';
import Button from '../Button';
import googleClassroomIcon from '../../../images/google-classroom-icon.png';
import msTeamIcon from '../../../images/ms-team-icon.svg';
import { passEventForKeys } from '../../services/events';

class Home extends Component {
    componentDidMount() {
        const {
            action,
            code,
        } = this.props.match.params;
        const {
            problemList,
        } = this.props;
        if (action === 'new') {
            this.props.clearProblemSet();
            if (!problemList.tempPalettes || problemList.tempPalettes.length === 0) {
                this.props.toggleModals([PALETTE_CHOOSER]);
            }
        } else if (action === 'solve') {
            this.props.loadProblemSetSolutionByEditCode(code);
        } else {
            this.props.requestProblemSet(action, code);
        }
        // mathLive.renderMathInDocument();
    }


    componentWillReceiveProps(newProps) {
        const {
            code,
        } = this.props.match.params;
        const newParams = newProps.match.params;
        if (newParams.action !== 'solve' && newParams.code !== code && newParams.action && newParams.code) {
            this.props.requestProblemSet(newParams.action, newParams.code);
        }
        setTimeout(() => {
            if (window && window.shareToMicrosoftTeams) {
                window.shareToMicrosoftTeams.renderButtons();
            }
        }, 0);
    }

    shareOnTwitter = () => {
        const {
            problemList,
        } = this.props;
        const shareUrl = `${window.location.origin}/#/app/problemSet/view/${problemList.newSetSharecode}`;
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${Locales.strings.share_with_teachers_text} ${shareUrl}`)}`, '_blank',
        );
    }

    shareProblemSet = () => {
        const { action, code } = this.props.match.params;
        this.props.shareSolutions(action, code);
    }

    shareOnGoogleClassroom = (e) => {
        const {
            problemList,
            match,
        } = this.props;
        const {
            action,
        } = match.params;
        e.preventDefault();
        const popupConfig = 'height=400,width=641,top=100,left=100,target=classroomPopup,toolbar=yes,scrollbars=yes,menubar=yes,location=no,resizable=yes';
        if (action === 'edit') {
            window.open(
                `https://classroom.google.com/u/0/share?url=${encodeURIComponent(`${this.getShareUrl()}`)}&title=${problemList.set.title}`,
                'googleClassroom',
                popupConfig,
            );
            IntercomAPI('trackEvent', 'assign-a-set-google-classroom');
        } else if (action === 'view' || action === 'solve') {
            window.open(
                `https://classroom.google.com/u/0/share?url=${encodeURIComponent(this.getShareUrl())}`,
                'googleClassroom',
                popupConfig,
            );
            IntercomAPI('trackEvent', 'submit-problem-set-google-classroom');
        }
    }

    getShareUrl = () => {
        const {
            problemList,
            match,
        } = this.props;
        const {
            action,
        } = match.params;
        if (action === 'edit') {
            return `${window.location.origin}/#/app/problemSet/view/${problemList.set.shareCode}`;
        } if (action === 'view' || action === 'solve') {
            return `${window.location.origin}/#/app/problemSet/review/${problemList.problemSetShareCode}`;
        }
        return '';
    }

    shareOnMicrosoftTeams = () => {
        const {
            match,
        } = this.props;
        const {
            action,
        } = match.params;
        const popupConfig = 'height=578,width=700,top=100,left=100,target=msTeamPopup,toolbar=yes,scrollbars=yes,menubar=yes,location=no,resizable=yes';
        window.open(
            `https://teams.microsoft.com/share?href=${encodeURIComponent(this.getShareUrl())}&preview=true&referrer=${window.location.hostname}`,
            'microsoftTeam',
            popupConfig,
        );
        if (action === 'edit') {
            IntercomAPI('trackEvent', 'assign-a-set-microsoft-team');
        } else if (action === 'view' || action === 'solve') {
            IntercomAPI('trackEvent', 'submit-problem-set-microsoft-team');
        }
    }

    renderNewAndEditControls = (currentSet) => {
        const {
            match,
            problemList,
        } = this.props;
        const {
            params,
        } = match;
        return (
            <React.Fragment>
                <div className={`row flex-row ${home.btnContainer}`}>
                    {(
                        (
                            params.action === 'new' && problemList.tempSet.problems.length > 0)
                        || params.action === 'edit'
                    ) && (
                        <React.Fragment>
                            <div className={home.text}>Assign: </div>
                            <Button
                                id="shareBtn"
                                className={classNames([
                                    'btn',
                                    'btn-outline-dark',
                                ])}
                                type="button"
                                icon="link"
                                content={Locales.strings.link}
                                onClick={() => {
                                    this.props.saveProblemSet(
                                        currentSet.problems,
                                        currentSet.title,
                                    );
                                    IntercomAPI('trackEvent', 'assign-a-set-link');
                                }}
                            />
                            <span>
                                <button
                                    id="googleContainer2"
                                    className={classNames([
                                        'btn',
                                        'btn-outline-dark',
                                        home.googleClassroomContainer,
                                        'pointer',
                                    ])}
                                    onClick={this.shareOnGoogleClassroom}
                                    onKeyPress={passEventForKeys(
                                        this.shareOnGoogleClassroom,
                                    )}
                                    type="button"
                                >
                                    <div className={home.btnText}>
                                        {'Google Classroom'}
                                        <span className="sROnly">
                                            {'\u00A0'}
                                            {Locales.strings.opens_in_new_window}
                                        </span>
                                    </div>
                                    <img src={googleClassroomIcon} alt="google classroom" />
                                </button>
                                <UncontrolledTooltip placement="top" target="googleContainer2" />
                            </span>
                            <span>
                                <button
                                    id="microsoftTeamContainer2"
                                    className={classNames([
                                        'btn',
                                        'btn-outline-dark',
                                        home.googleClassroomContainer,
                                        'pointer',
                                    ])}
                                    onClick={this.shareOnMicrosoftTeams}
                                    onKeyPress={this.shareOnMicrosoftTeams}
                                    type="button"
                                >
                                    <div className={home.btnText}>
                                        {'Microsoft Teams'}
                                        <span className="sROnly">
                                            {'\u00A0'}
                                            {Locales.strings.opens_in_new_window}
                                        </span>
                                    </div>
                                    <img src={msTeamIcon} alt="microsoft teams" />
                                </button>
                                <UncontrolledTooltip placement="top" target="microsoftTeamContainer2" />
                            </span>
                        </React.Fragment>
                    )}
                </div>
                <div className="row flex-row-reverse">
                    <div className={home.secondRowBtn}>
                        <Button
                            id="viewAsStudent"
                            className={classNames([
                                'btn',
                                'btn-outline-dark',
                            ])}
                            type="button"
                            icon="eye"
                            content={Locales.strings.view_as_student}
                            onClick={() => {
                                this.props.saveProblemSet(
                                    currentSet.problems,
                                    currentSet.title,
                                    true,
                                );
                            }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className={classNames('col-lg-12', 'm-3', 'text-left')}>
                        <h1 id="LeftNavigationHeader" className={home.titleHeader} tabIndex="-1">
                            {currentSet.title}
                        </h1>
                        <button
                            className="reset-btn"
                            onClick={() => {
                                this.props.toggleModals([TITLE_EDIT_MODAL]);
                            }}
                            onKeyPress={passEventForKeys(() => {
                                this.props.toggleModals([TITLE_EDIT_MODAL]);
                            })}
                            type="button"
                        >
                            <FontAwesome
                                name="edit"
                                className={
                                    classNames(
                                        'fa-2x',
                                    )
                                }
                            />
                        </button>
                        {/* <div className={home.spaceInBetween} /> */}
                        <div className="dropdown">
                            <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <FontAwesome
                                    className={
                                        classNames(
                                            'fa-2x',
                                        )
                                    }
                                    name="ellipsis-v"
                                />
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {params.action === 'edit' && (
                                    /* eslint-disable jsx-a11y/anchor-is-valid */
                                    <React.Fragment>
                                        <button
                                            className="dropdown-item"
                                            onClick={this.props.duplicateProblemSet}
                                            onKeyPress={
                                                passEventForKeys(this.props.duplicateProblemSet)
                                            }
                                            type="button"
                                        >
                                            <FontAwesome
                                                size="lg"
                                                name="copy"
                                            />
                                            {` ${Locales.strings.duplicate_set}`}
                                            <span className="sROnly">
                                                {'\u00A0'}
                                                {Locales.strings.opens_in_new_tab}
                                            </span>
                                        </button>
                                        <button
                                            className="dropdown-item"
                                            onClick={this.shareOnTwitter}
                                            onKeyPress={passEventForKeys(this.shareOnTwitter)}
                                            type="button"
                                        >
                                            <FontAwesome
                                                size="lg"
                                                name="twitter"
                                            />
                                            {` ${Locales.strings.share_with_teachers}`}
                                            <span className="sROnly">
                                                {'\u00A0'}
                                                {Locales.strings.opens_in_new_window}
                                            </span>
                                        </button>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                        <br aria-hidden="true" />
                        <br aria-hidden="true" />
                    </div>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const {
            match,
            problemList,
        } = this.props;
        const {
            params,
        } = match;
        let currentSet = problemList.set;
        if (params && params.action === 'new') {
            currentSet = problemList.tempSet;
        }
        if (problemList.notFound) {
            return <NotFound />;
        }
        return (
            <div className={home.mainWrapper}>
                <NotificationContainer />
                <MainPageHeader
                    editing={params.action === 'edit' || params.action === 'new'}
                    history={this.props.history}
                    addProblemSetCallback={this.props.addProblemSet}
                    duplicateProblemSet={this.props.duplicateProblemSet}
                    editCode={problemList.set.editCode}
                    action={params.action}
                />
                <div id="mainContainer">
                    <main id="LeftNavigation" className={home.leftNavigation}>
                        {(params.action !== 'review' && (params.action !== 'edit' && params.action !== 'new')) && (
                            <div className={classNames([
                                'row',
                                home.actionBar,
                            ])}
                            >
                                <div className={classNames([
                                    'align-self-end',
                                    'col',
                                ])}
                                />
                                <div className={home.right}>
                                    <span className={home.actionBarText}>
                                        {Locales.strings.submit}
                                        :
                                        {' '}
                                    </span>
                                    <Button
                                        id="shareBtn"
                                        className={classNames([
                                            'btn',
                                            'btn-outline-dark',
                                        ])}
                                        type="button"
                                        icon="link"
                                        content={Locales.strings.link}
                                        onClick={this.shareProblemSet}
                                    />
                                    <span>
                                        <button
                                            id="googleContainer1"
                                            className={classNames([
                                                'btn',
                                                'btn-outline-dark',
                                                home.googleClassroomContainer,
                                                'pointer',
                                            ])}
                                            onClick={this.shareOnGoogleClassroom}
                                            onKeyPress={
                                                passEventForKeys(this.shareOnGoogleClassroom)
                                            }
                                            type="button"
                                        >
                                            <div className={home.btnText}>Google Classroom</div>
                                            <img src={googleClassroomIcon} alt="google classroom" />
                                        </button>
                                        <UncontrolledTooltip placement="top" target="googleContainer1" />
                                    </span>
                                    <span>
                                        <button
                                            id="microsoftTeamContainer1"
                                            className={classNames([
                                                'btn',
                                                'btn-outline-dark',
                                                home.googleClassroomContainer,
                                                'pointer',
                                            ])}
                                            onClick={this.shareOnMicrosoftTeams}
                                            onKeyPress={
                                                passEventForKeys(this.shareOnMicrosoftTeams)
                                            }
                                            type="button"
                                        >
                                            <div className={home.btnText}>Microsoft Teams</div>
                                            <img src={msTeamIcon} alt="microsoft teams" />
                                        </button>
                                        <UncontrolledTooltip placement="top" target="microsoftTeamContainer1" />
                                    </span>
                                </div>
                            </div>
                        )}
                        {(params.action === 'new' || params.action === 'edit') && (
                            this.renderNewAndEditControls(currentSet)
                        )}
                        {(params.action !== 'new' && params.action !== 'edit') && (
                            <NavigationHeader
                                action={params.action}
                                set={problemList.set}
                            />
                        )}
                        <NavigationProblems
                            problems={currentSet.problems}
                            solutions={problemList.solutions}
                            editing={params.action === 'edit' || params.action === 'new'}
                            activateModals={this.props.toggleModals}
                            updatePositions={this.props.updatePositions}
                            action={params.action}
                            code={params.code}
                            setEditProblem={this.props.setEditProblem}
                        />
                    </main>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        problemList: state.problemList,
    }),
    problemActions,
)(Home);
