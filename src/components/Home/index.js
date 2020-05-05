import React, { Component } from 'react';
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
import { passEventForKeys } from '../../services/events';
import CommonDropdown from '../CommonDropdown';


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
                <div className={`row flex-row ${home.btnContainer}`}>
                    {(
                        (
                            params.action === 'new' && problemList.tempSet.problems.length > 0)
                        || params.action === 'edit'
                    ) && (
                        <RenderActionButtons>
                            {[
                                <Button
                                    id="shareBtn"
                                    className={classNames([
                                        'btn',
                                        'btn-outline-dark',
                                    ])}
                                    type="button"
                                    icon="share"
                                    content={`\u00A0${Locales.strings.share_problem_set}`}
                                    onClick={this.saveProblemSet(currentSet)}
                                />,
                            ]}
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
                <main id="mainContainer" className={home.leftNavigation}>
                    {(params.action !== 'new' && params.action !== 'edit') && (
                        <NavigationHeader
                            action={params.action}
                            set={problemList.set}
                        />
                    )}
                    {(params.action !== 'review' && (params.action !== 'edit' && params.action !== 'new')) && currentSet.problems.length > 0 && (
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
