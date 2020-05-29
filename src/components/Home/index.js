import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import { IntercomAPI } from 'react-intercom';
import { Helmet } from 'react-helmet';
import MainPageHeader from './components/Header';
import NavigationHeader from './components/Navigation/Header';
import NavigationProblems from './components/Navigation/Problems';
import { TITLE_EDIT_MODAL, PALETTE_CHOOSER, PALETTE_UPDATE_CHOOSER } from '../ModalContainer';
import googleAnalytics from '../../scripts/googleAnalytics';
import NotFound from '../NotFound';
import home from './styles.scss';
import Locales from '../../strings';
import problemListActions from '../../redux/problemList/actions';
import problemActions from '../../redux/problem/actions';
import ariaLiveAnnouncerActions from '../../redux/ariaLiveAnnouncer/actions';
import Button from '../Button';
import { passEventForKeys } from '../../services/events';
import CommonDropdown from '../CommonDropdown';
import Toggle from '../Toggle';
import CopyLink from './components/CopyLink';


const RenderActionButtons = ({ additionalClassName, children }) => (
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
            additionalClassName || '',
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

    copyResumeWorkUrlCallback = () => {
        googleAnalytics('pressed copy resume work link button');
        IntercomAPI('trackEvent', 'pressed-copy-resume-work-link-button');
    }

    selectTextInput = () => {
        const copyText = document.getElementById('resumeWorkUrl');
        copyText.select();
    }

    sendResumeLinkClickEvent = () => {
        googleAnalytics('clicked on resume work link');
        IntercomAPI('trackEvent', 'clicked-resume-work-link');
    }

    updateRequireExplanations = (pressed) => {
        this.props.updateProblemSetPayload({ optionalExplanations: !pressed });
    }

    updateIncludeSteps = (pressed) => {
        this.props.updateProblemSetPayload({ hideSteps: !pressed });
    }

    updatePaletteModal = () => {
        this.props.toggleModals([PALETTE_UPDATE_CHOOSER]);
    }

    renderNewAndEditControls = (currentSet) => {
        const {
            match,
        } = this.props;
        const {
            params,
        } = match;

        return (
            <React.Fragment>
                <div>
                    <div className={classNames('m-3', 'text-left')}>
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
                                <>
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
                                        {` ${Locales.strings.duplicate}`}
                                        <span className="sROnly">
                                            {'\u00A0'}
                                            {Locales.strings.opens_in_new_tab}
                                        </span>
                                    </button>
                                    {params.action === 'edit' && (
                                        <Button
                                            id="shareBtn"
                                            className={classNames([
                                                'dropdown-item',
                                            ])}
                                            type="button"
                                            icon="share"
                                            content={`\u00A0${Locales.strings.share_problem_set}`}
                                            onClick={this.saveProblemSet(currentSet)}
                                            onKeyPress={passEventForKeys(
                                                this.saveProblemSet(currentSet),
                                            )}
                                        />
                                    )}
                                </>
                            )}
                        </CommonDropdown>
                    </div>
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

    renderNotLoggedInWarning = () => {
        const { userProfile, match } = this.props;
        const { params } = match;
        if (params.action !== 'edit' && params.action !== 'solve') {
            return null;
        }
        if (userProfile.checking || userProfile.email) {
            return null;
        }
        return (
            <>
                <div className={`row ${home.warningContainer}`}>
                    <div className={home.loginWarning}>
                        <h2 className={home.warningText}>
                            {Locales.strings.warning}
                            {': '}
                        </h2>
                        {params.action === 'solve' ? Locales.strings.return_to_your_work_later : Locales.strings.return_to_your_problem_later}
                    </div>
                </div>
                <div className="row">
                    <div className={home.shareLink}>
                        <label htmlFor="resumeWorkUrl" className="sROnly">
                            {Locales.strings.work_link}
                        </label>
                        <input
                            id="resumeWorkUrl"
                            type="text"
                            value={window.location.href}
                            readOnly
                            onFocus={this.selectTextInput}
                            onClick={this.sendResumeLinkClickEvent}
                        />
                        <CopyLink
                            icon="copy"
                            iconSize="sm"
                            announceOnAriaLive={this.props.announceOnAriaLive}
                            announceText={Locales.strings.work_link_copied}
                            copyText={`\u00A0${Locales.strings.copy_work_link}`}
                            shareLinkId="resumeWorkUrl"
                            className={classNames([
                                'btn',
                                'btn-outline-dark',
                            ])}
                            copyLinkCallback={this.copyResumeWorkUrlCallback}
                        />
                    </div>
                </div>
            </>
        );
    }

    renderProblemSetControls = () => {
        const {
            match,
            problemList,
        } = this.props;
        const {
            params,
        } = match;
        const currentSet = problemList.set;
        if (params.action !== 'edit' || !currentSet.editCode) {
            return null;
        }
        return (
            <div className={classNames('row', 'm-2', home.setControls)}>
                <h2 id="problem_set_controls" className={classNames('col-12')}>{Locales.strings.problem_set_controls}</h2>
                <ul className={classNames('col-4', home.controlRadios)} aria-labelledby="problem_set_controls">
                    <li>
                        <Toggle
                            btnClass={home.toggleBtn}
                            text={Locales.strings.require_explanations}
                            callback={this.updateRequireExplanations}
                            defaultPressed={!currentSet.optionalExplanations}
                        />
                    </li>
                    <li>
                        <Toggle
                            btnClass={home.toggleBtn}
                            text={Locales.strings.include_my_work}
                            callback={this.updateIncludeSteps}
                            defaultPressed={!currentSet.hideSteps}
                        />
                    </li>
                </ul>
                <ul className={classNames('col-4', home.btnContainer, home.changeMathSymbols)} aria-labelledby="problem_set_controls">
                    <li>
                        <Button
                            id="changeMathSymbol"
                            className={classNames([
                                'btn',
                                'btn-outline-dark',
                            ])}
                            type="button"
                            content={Locales.strings.change_math_symbols}
                            onClick={this.updatePaletteModal}
                        />
                    </li>
                </ul>
            </div>
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
                    {(params.action !== 'review' && params.action !== 'new') && currentSet.problems.length > 0 && (
                        <RenderActionButtons additionalClassName={home.floatingBtnBar}>
                            {[
                                <Button
                                    id="shareBtn"
                                    className={classNames([
                                        'btn',
                                        'btn-outline-dark',
                                    ])}
                                    type="button"
                                    icon="check-circle"
                                    content={`\u00A0${Locales.strings.share_my_answers}`}
                                    onClick={this.shareProblemSet}
                                />,
                            ]}
                        </RenderActionButtons>
                    )}
                    {this.renderNotLoggedInWarning()}
                    <NavigationProblems
                        problems={currentSet.problems}
                        solutions={problemList.solutions}
                        editing={params.action === 'edit' || params.action === 'new'}
                        activateModals={this.props.toggleModals}
                        updatePositions={this.props.updatePositions}
                        action={params.action}
                        code={params.code}
                        setEditProblem={this.props.setEditProblem}
                    >
                        <>
                            {this.renderProblemSetControls()}
                            <h2 id="problems_in_this_set" className="sROnly" tabIndex={-1}>{Locales.strings.problems_in_this_set}</h2>
                        </>
                    </NavigationProblems>
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
        ...ariaLiveAnnouncerActions,
        ...problemActions,
        ...problemListActions,
    },
)(Home);
