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
import problemActions from '../../redux/problemList/actions';
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
                            {params.action === 'edit' && (
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
                                        {` ${Locales.strings.share_on_twitter}`}
                                        <span className="sROnly">
                                            {'\u00A0'}
                                            {Locales.strings.opens_in_new_tab}
                                        </span>
                                    </button>
                                </React.Fragment>
                            )}
                        </CommonDropdown>
                    </div>
                </div>
                <div className={`row flex-row ${home.btnContainer}`}>
                    {(
                        (
                            params.action === 'new' && problemList.tempSet.problems.length > 0)
                        || params.action === 'edit'
                    ) && (
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
                            <Button
                                id="viewAsStudent"
                                className={classNames([
                                    'btn',
                                    'btn-outline-dark',
                                ])}
                                type="button"
                                icon="eye"
                                content={Locales.strings.view_as_student}
                                onClick={this.saveProblemSet(currentSet, true)}
                                onKeyPress={passEventForKeys(this.saveProblemSet(currentSet, true))}
                            />
                        </RenderActionButtons>
                    )}
                </div>
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
                <div id="mainContainer">
                    <main id="LeftNavigation" className={home.leftNavigation}>
                        {(params.action !== 'new' && params.action !== 'edit') && (
                            <NavigationHeader
                                action={params.action}
                                set={problemList.set}
                            />
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
                                </RenderActionButtons>

                            </div>
                        )}
                        {(params.action === 'new' || params.action === 'edit') && (
                            this.renderNewAndEditControls(currentSet)
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
