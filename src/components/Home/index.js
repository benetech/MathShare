import React, { Component } from 'react';
import { NotificationContainer } from 'react-notifications';
import { UncontrolledTooltip } from 'reactstrap';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import MainPageHeader from './components/Header';
import NavigationHeader from './components/Navigation/Header';
import NavigationProblems from './components/Navigation/Problems';
import { TITLE_EDIT_MODAL, PALETTE_CHOOSER } from '../ModalContainer';
import NotFound from '../NotFound';
import home from './styles.scss';
import Locales from '../../strings';
import problemActions from '../../redux/problemList/actions';
import Button from '../Button';

class Home extends Component {
    componentDidMount() {
        const {
            action, code,
        } = this.props.match.params;
        const {
            problemList,
        } = this.props;
        if (action === 'new') {
            this.props.clearProblemSet();
            if (!problemList.tempPalettes || problemList.tempPalettes.length === 0) {
                this.props.toggleModals([PALETTE_CHOOSER]);
            }
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
        if (newParams.code !== code && newParams.action && newParams.code) {
            this.props.requestProblemSet(newParams.action, newParams.code);
        }
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
                `https://classroom.google.com/u/0/share?url=${encodeURIComponent(`${window.location.origin}/#/app/problemSet/view/${problemList.set.shareCode}`)}&title=${problemList.set.title}`,
                'googleClassroom',
                popupConfig,
            );
        } else if (action === 'view') {
            window.open(
                `https://classroom.google.com/u/0/share?url=${encodeURIComponent(`${window.location.origin}/#/app/problemSet/review/${problemList.problemSetShareCode}`)}`,
                'googleClassroom',
                popupConfig,
            );
        }
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
                                        onKeyPress={this.shareOnGoogleClassroom}
                                        role="link"
                                        tabIndex="0"
                                        type="button"
                                    >
                                        <div className={home.btnText}>Google Classroom</div>
                                        <div
                                            id="submitInClassroom"
                                            data-size="32"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            onKeyPress={(e) => {
                                                e.stopPropagation();
                                            }}
                                            role="link"
                                            tabIndex="-1"
                                        />
                                    </button>
                                    <UncontrolledTooltip placement="top" target="googleContainer1" />
                                </span>
                            </div>
                        </div>
                    )}
                    {(params.action === 'new' || params.action === 'edit') && (
                        <React.Fragment>
                            <div className={`row flex-row-reverse ${home.btnContainer}`}>
                                {((params.action === 'new' && problemList.tempSet.problems.length > 0) || params.action === 'edit') && (
                                    <React.Fragment>
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
                                                onKeyPress={this.shareOnGoogleClassroom}
                                                role="link"
                                                tabIndex="0"
                                                type="button"
                                            >
                                                <div className={home.btnText}>Google Classroom</div>
                                                <div
                                                    id="shareInClassroom"
                                                    data-size="32"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                    onKeyPress={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                    role="link"
                                                    tabIndex="-1"
                                                />
                                            </button>
                                            <UncontrolledTooltip placement="top" target="googleContainer2" />
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
                                            onClick={() => {
                                                this.props.saveProblemSet(
                                                    currentSet.problems,
                                                    currentSet.title,
                                                    true,
                                                );
                                            }}
                                        />
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
                                            }}
                                        />
                                        <div className={home.text}>Assign: </div>
                                    </React.Fragment>
                                )}
                            </div>
                            <div className="row">
                                <div className={classNames('col-lg-12', 'm-3', 'text-left')}>
                                    <h1 id="LeftNavigationHeader" className={home.titleHeader} tabIndex="-1">
                                        {currentSet.title}
                                    </h1>
                                    <FontAwesome
                                        className={
                                            classNames(
                                                'fa-2x',
                                            )
                                        }
                                        onClick={() => {
                                            this.props.toggleModals([TITLE_EDIT_MODAL]);
                                        }}
                                        name="edit"
                                    />
                                    <br aria-hidden="true" />
                                    <br aria-hidden="true" />
                                </div>
                            </div>
                        </React.Fragment>
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
        );
    }
}

export default connect(
    state => ({
        problemList: state.problemList,
    }),
    problemActions,
)(Home);
