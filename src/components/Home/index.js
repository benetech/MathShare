import React, { Component } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import { IntercomAPI } from 'react-intercom';
import { Helmet } from 'react-helmet';
import MainPageHeader from './components/Header';
import NavigationHeader from './components/Navigation/Header';
import NavigationProblems from './components/Navigation/Problems';
import { TITLE_EDIT_MODAL, PALETTE_CHOOSER } from '../ModalContainer';
import NotFound from '../NotFound';
import home from './styles.scss';
import Locales from '../../strings';
import problemListActions from '../../redux/problemList/actions';
import problemActions from '../../redux/problem/actions';
import Button from '../Button';
import googleClassroomIcon from '../../../images/google-classroom-icon.png';
import msTeamIcon from '../../../images/ms-team-icon.svg';
import { passEventForKeys } from '../../services/events';
import CommonDropdown from '../CommonDropdown';


const RenderActionButtons = ({ children }) => (
    <React.Fragment>
        <h2
            id="actions_for_this_problem_set"
            className="sROnly"
            tabIndex={-1}
        >
            {Locales.strings.actions_for_this_problem_set}
        </h2>
        <div className={classNames([
            home.btnContainer,
            home.right,
        ])}
        >
            <ul aria-labelledby="actions_for_this_problem_set">
                {children.map((child, index) => (<li key={index}>{child}</li>))}
            </ul>
        </div>
    </React.Fragment>
);

class Home extends Component {
    componentDidMount() {
        const {
            action,
            code,
        } = this.props.match.params;
        if (action === 'new') {
            this.props.clearProblemSet();
            this.newProblemSet();
        } else {
            this.loadData(action, code);
        }
    }


    componentWillReceiveProps(newProps) {
        const {
            action,
            code,
        } = this.props.match.params;
        const newParams = newProps.match.params;
        if (newParams.code !== code && newParams.action !== action
            && newParams.action && newParams.code
            && action !== 'view' && newParams.action !== 'solve') {
            this.loadData(newParams.action, newParams.code);
        }
        setTimeout(() => {
            if (window && window.shareToMicrosoftTeams) {
                window.shareToMicrosoftTeams.renderButtons();
            }
        }, 0);
    }

    newProblemSet = () => {
        const {
            problemList,
            userProfile,
        } = this.props;
        if (userProfile.checking) {
            setTimeout(this.newProblemSet, 500);
        } else if (!problemList.tempPalettes || problemList.tempPalettes.length === 0) {
            if (userProfile.info && userProfile.info.userType === 'student') {
                this.props.progressToAddingProblems([
                    'Edit',
                    'Operators',
                    'Notations',
                    'Geometry',
                ], true);
            } else {
                this.props.toggleModals([PALETTE_CHOOSER]);
            }
        }
    }

    loadData = (action, code) => {
        const {
            problemList,
        } = this.props;
        const {
            set, solutions, title, archiveMode, source, reviewCode,
        } = problemList;
        const { editCode } = set;
        if (action === 'edit' || action === 'solve') {
            if (editCode === code) {
                if (action === 'edit') {
                    this.props.requestProblemSetSuccess(set);
                }
                if (action === 'solve') {
                    this.props.setReviewSolutions(
                        set.id, solutions, reviewCode, editCode, title, archiveMode, source,
                    );
                }
                return;
            }
        }

        if (action === 'review' && reviewCode === code) {
            this.props.setReviewSolutions(
                set.id, solutions, reviewCode, editCode, title, archiveMode, source,
            );
            return;
        }

        if (action === 'solve') {
            this.props.loadProblemSetSolutionByEditCode(code);
        } else {
            this.props.requestProblemSet(action, code);
        }
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

    saveProblemSet = (currentSet, redirect) => () => {
        this.props.saveProblemSet(
            currentSet.problems,
            currentSet.title,
            redirect,
        );
        if (!redirect) {
            IntercomAPI('trackEvent', 'assign-a-set-link');
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
                <div className="row">
                    <div className={classNames('col-lg-12', 'm-3', 'text-left')}>
                        <h1 id="LeftNavigationHeader" className={home.titleHeader} tabIndex="-1">
                            {currentSet.title || Locales.strings.untitled_problem_set}
                        </h1>
                        {params.action !== 'solve' && (
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
                                <span className="sROnly">{Locales.strings.edit_title}</span>
                            </button>
                        )}
                        <CommonDropdown
                            btnId="dropdownMenuButton"
                            btnClass="nav-link reset-btn"
                            btnIcon="ellipsis-v"
                            btnIconSize="2x"
                            containerClass=""
                            containerTag="li"
                            btnContent={(
                                <span className="sROnly">{Locales.strings.more_options}</span>
                            )}
                            listClass="dropdown-menu-lg-right dropdown-secondary"
                        >
                            {(params.action === 'edit' || params.action === 'solve') && (
                                [
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
                                    </button>,
                                ]
                            )}
                        </CommonDropdown>
                    </div>
                </div>
                {(
                    (
                        params.action === 'new' && problemList.tempSet.problems.length > 0)
                    || params.action === 'edit'
                ) && (
                    <div className={`row flex-row ${home.btnContainer}`}>
                        <RenderActionButtons>
                            <Button
                                id="shareBtn"
                                className={classNames([
                                    'btn',
                                    'btn-outline-dark',
                                ])}
                                type="button"
                                icon="link"
                                content={`\u00A0${Locales.strings.share_permalink}`}
                                onClick={this.saveProblemSet(currentSet)}
                                onKeyPress={passEventForKeys(this.saveProblemSet(currentSet))}
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
                                    <span className={home.btnText}>
                                        <span className="sROnly">
                                            {Locales.strings.share_on}
                                        </span>
                                        {Locales.strings.google_classroom}
                                        <span className="sROnly">
                                            {'\u00A0'}
                                            {Locales.strings.opens_in_new_tab}
                                        </span>
                                    </span>
                                    <img src={googleClassroomIcon} alt="" />
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
                                    onKeyPress={passEventForKeys(this.shareOnMicrosoftTeams)}
                                    type="button"
                                >
                                    <span className={home.btnText}>
                                        <span className="sROnly">
                                            {Locales.strings.share_on}
                                        </span>
                                        {Locales.strings.ms_team}
                                        <span className="sROnly">
                                            {'\u00A0'}
                                            {Locales.strings.opens_in_new_tab}
                                        </span>
                                    </span>
                                    <img src={msTeamIcon} alt="" />
                                </button>
                                <UncontrolledTooltip placement="top" target="microsoftTeamContainer2" />
                            </span>
                        </RenderActionButtons>
                    </div>
                )}
            </React.Fragment>
        );
    }

    renderHelmet = () => {
        const {
            problemList,
        } = this.props;
        let titlePrefix = '';
        if (problemList.set && problemList.set.shareCode) {
            if (problemList.set.title) {
                titlePrefix = `${problemList.set.title} - `;
            } else {
                titlePrefix = `${Locales.strings.untitled_problem_set} - `;
            }
        } else {
            return null;
        }
        return (
            <Helmet>
                <title>
                    {titlePrefix}
                    {Locales.strings.mathshare_benetech}
                </title>
            </Helmet>
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
                {this.renderHelmet()}
                <MainPageHeader
                    editing={params.action === 'edit' || params.action === 'new'}
                    history={this.props.history}
                    addProblemSetCallback={this.props.addProblemSet}
                    duplicateProblemSet={this.props.duplicateProblemSet}
                    editCode={problemList.set.editCode}
                    action={params.action}
                />
                <main id="mainContainer" className={home.leftNavigation}>
                    {(params.action !== 'new' && params.action !== 'edit' && params.action !== 'solve') && (
                        <NavigationHeader
                            action={params.action}
                            set={problemList.set}
                        />
                    )}
                    {(params.action === 'new' || params.action === 'edit' || params.action === 'solve') && (
                        this.renderNewAndEditControls(currentSet)
                    )}
                    {(params.action !== 'review' && (params.action !== 'edit' && params.action !== 'new')) && currentSet.problems.length > 0 && (
                        <div className={classNames([
                            'row',
                            home.actionBar,
                            home.btnContainer,
                        ])}
                        >
                            <div className={classNames([
                                'align-self-end',
                                'col',
                            ])}
                            />
                            <RenderActionButtons>
                                <Button
                                    id="shareBtn"
                                    className={classNames([
                                        'btn',
                                        'btn-outline-dark',
                                    ])}
                                    type="button"
                                    icon="link"
                                    content={Locales.strings.share_permalink}
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
                                        <span className={home.btnText}>
                                            <span className="sROnly">
                                                {Locales.strings.share_on}
                                            </span>
                                            {Locales.strings.google_classroom}
                                            <span className="sROnly">
                                                {'\u00A0'}
                                                {Locales.strings.opens_in_new_tab}
                                            </span>
                                        </span>
                                        <img src={googleClassroomIcon} alt="" />
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
                                        <span className={home.btnText}>
                                            <span className="sROnly">
                                                {Locales.strings.share_on}
                                            </span>
                                            {Locales.strings.ms_team}
                                            <span className="sROnly">
                                                {'\u00A0'}
                                                {Locales.strings.opens_in_new_tab}
                                            </span>
                                        </span>
                                        <img
                                            src={msTeamIcon}
                                            alt=""
                                        />
                                    </button>
                                    <UncontrolledTooltip placement="top" target="microsoftTeamContainer1" />
                                </span>
                                {currentSet.partner && currentSet.partner.canSubmit && (
                                    <Button
                                        id="partnerBtn"
                                        className={classNames([
                                            'btn',
                                            'btn-outline-dark',
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
                            </RenderActionButtons>
                        </div>
                    )}
                    <h2 id="problems_in_this_set" className="sROnly" tabIndex={-1}>{Locales.strings.problems_in_this_set}</h2>
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
        );
    }
}

export default connect(
    state => ({
        problemList: state.problemList,
        userProfile: state.userProfile,
    }),
    {
        ...problemActions,
        ...problemListActions,
    },
)(Home);
