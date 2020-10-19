import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import {
    Switch, Route, withRouter,
} from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faSignature,
    faSquareRootAlt,
} from '@fortawesome/free-solid-svg-icons';
import * as dayjs from 'dayjs';
import { UserAgentApplication } from 'msal';
import Intercom, { IntercomAPI } from 'react-intercom';
import {
    GlobalHotKeys, ObserveKeys,
    configure,
} from 'react-hotkeys';
import PageIndex from './PageIndex';
import NotFound from './NotFound';
import Home from './Home';
import Editor from './Editor';
import LandingPage from './LandingPage';
import Privacy from './Privacy';
import Partners from './Partners';
import SignIn from './SignIn';
import UserDetails from './UserDetails';
import GettingStarted from './GettingStarted';
import AriaLiveAnnouncer from './AriaLiveAnnouncer';
import MainPageFooter from './Home/components/Footer';
import SocialFooter from './Home/components/SocialFooter';
import SiteMapFooter from './Home/components/SiteMapFooter';
import Locales from '../strings';
import ModalContainer, {
    CONFIRMATION,
    CONFIRMATION_BACK,
    PALETTE_CHOOSER, // ADD_PROBLEM_SET,
    PALETTE_UPDATE_CHOOSER,
    EDIT_PROBLEM,
} from './ModalContainer';
import { configClassMap } from './ModalContainer/components/PersonalizationModal';
import { alertWarning } from '../scripts/alert';
import googleAnalytics from '../scripts/googleAnalytics';
import { FRONTEND_URL_PROTO } from '../config';
import problemListActions from '../redux/problemList/actions';
import problemActions from '../redux/problem/actions';
import userProfileActions from '../redux/userProfile/actions';
import ariaLiveAnnouncerActions from '../redux/ariaLiveAnnouncer/actions';
import routerActions from '../redux/router/actions';
import uiActions from '../redux/ui/actions';
import { compareStepArrays } from '../redux/problem/helpers';
import msalConfig from '../constants/msal';
import keyMap from '../constants/hotkeyConfig.json';
import { stopEvent, passEventForKeys } from '../services/events';
import { getPathTo } from '../services/dom';
import './styles.scss';
import { getFormattedUserType } from '../services/mathshare';


const mathLive = process.env.MATHLIVE_DEBUG_MODE
    ? require('../../mathlive/src/mathlive.js').default
    : require('../lib/mathlivedist/mathlive.js');

configure({
    // logLevel: 'verbose',
    ignoreEventsCondition: () => false,
    ignoreKeymapAndHandlerChangesByDefault: false,
});

// TODO: add font to class map

class App extends Component {
    constructor(props) {
        super(props);
        this.initializeIcons();

        if (window.location.hash.includes('id_token')) {
            // eslint-disable-next-line no-new
            new UserAgentApplication(msalConfig);
            window.close();
        }

        this.state = {
            showDialog: false,
            filter: '',
        };

        this.handlers = {
            MOVE_TO_MATH_INPUT: this.moveFoucsTo('mathEditorActive'),
            SHOW_DIALOG: this.toggleDialog,
            CLOSE_DIALOG: () => this.setState({ showDialog: false }),
            MOVE_TO_DESCRIPTION_BOX: this.moveFoucsTo('mathAnnotation'),
            READ_PROBLEM_MATH: this.readProblem,
        };

        document.body.addEventListener('click', (e) => {
            const { target } = e;
            if (target.tagName === 'A' && target.attributes && target.attributes.href) {
                this.props.storeXPathToAnchor(getPathTo(target), target.attributes.href.value);
            }
            const skip = Array.from(document.querySelectorAll('.dropdown-menu,.dropdown-toggle,#react-aria-modal-dialog')).find(toggle => toggle.contains(target));
            if (!skip && Array.from(document.querySelectorAll('#root')).find(toggle => toggle.contains(target))) {
                this.props.setDropdownId(null);
            }
        });

        document.body.addEventListener('keydown', (e) => {
            const { key, target } = e;
            if (key === 'Escape' && Array.from(document.querySelectorAll('.dropdown-menu,.dropdown-toggle')).find(toggle => toggle.contains(target))) {
                this.props.setDropdownId(null);
            }
        });
    }

    componentDidMount() {
        this.props.checkUserLogin();
    }

    shouldComponentUpdate() {
        return true;
    }

    initializeIcons = () => {
        library.add(faSignature, faSquareRootAlt);
    };

    moveFoucsTo = id => (e) => {
        const mathElement = document.getElementById(id);
        if (mathElement) {
            mathElement.focus();
            return stopEvent(e);
        }
        return true;
    }

    toggleDialog = (e) => {
        this.setState(prevState => ({
            showDialog: !prevState.showDialog,
        }));
        return stopEvent(e);
    }

    readProblem = (e) => {
        const problemTitle = document.getElementById('ProblemTitle');
        if (problemTitle) {
            this.props.announceOnAriaLive(problemTitle.innerText);
        }
        setTimeout(() => {
            this.props.clearAriaLive();
        }, 1000);
        return stopEvent(e);
    }

    addProblem = (imageData, text, index, newProblemSet) => {
        if (!this.validateProblem(text, imageData)) {
            return false;
        }
        IntercomAPI('trackEvent', 'create-a-problem');
        this.props.addProblem(imageData, text, index, newProblemSet);
        this.props.announceOnAriaLive(Locales.strings.added_problem_at_index.replace('{index}', index + 1));
        return true;
    };

    validateProblem = (text, image) => {
        const { problemList } = this.props;
        let message;
        if (text === '' || $.trim(text).length === 0) {
            if (problemList.theActiveMathField.$latex() === '' && image === null) {
                message = Locales.strings.no_problem_equation_or_image_and_title_warning;
            } else {
                message = Locales.strings.no_problem_title_warning;
            }
        } else if (problemList.theActiveMathField.$latex() === '' && image === null) {
            message = Locales.strings.no_problem_equation_or_image_warning;
        }

        if (message) {
            alertWarning(message, Locales.strings.warning);
            this.props.announceOnAriaLive(message);
            setTimeout(() => {
                $('#mathAnnotation').focus();
            }, 6000);
            return false;
        }
        return true;
    };

    deleteProblem = () => {
        this.props.deleteProblem();
        setTimeout(() => {
            mathLive.renderMathInDocument();
        }, 200);
        this.props.toggleModals([CONFIRMATION]);
    };

    editProblem = (imageData, title) => {
        if (!this.validateProblem(title, imageData)) {
            return;
        }
        this.props.editProblem(imageData, title);
        setTimeout(() => {
            mathLive.renderMathInDocument();
        }, 200);
        this.props.toggleModals([EDIT_PROBLEM]);
    };

    updatePositions = (problems) => {
        const updatedProblems = problems.map((problem, position) => ({
            ...problem,
            position,
        }));
        this.props.saveProblems(updatedProblems);
    };

    addProblemSet = () => {
        const { userProfile } = this.props;
        if (userProfile.checking) {
            setTimeout(this.addProblemSet, 500);
        } else {
            if (userProfile.info && userProfile.info.userType === 'student') {
                this.progressToAddingProblems([
                    'Edit',
                    'Operators',
                    'Notations',
                    'Geometry',
                ], true);
            } else {
                this.props.toggleModals([PALETTE_CHOOSER]);
            }
            googleAnalytics('new problem set button');
            IntercomAPI('trackEvent', 'create-a-set');
        }
    };

    progressToAddingProblems = (palettes, dontToggleModal = false) => {
        if (palettes.length === 0) {
            alertWarning(
                Locales.strings.no_palettes_chosen_warning,
                Locales.strings.warning,
            );
            return;
        }
        this.props.setTempPalettes(palettes);
        // this.props.toggleModals([PALETTE_CHOOSER, ADD_PROBLEM_SET]);
        if (!dontToggleModal) {
            this.props.toggleModals([PALETTE_CHOOSER]);
        }
        this.props.history.push('/app/problemSet/new');
        this.props.saveProblemSet([], `${Locales.strings.new_problem_set} ${dayjs().format('MM-DD-YYYY')}`, null);
    }

    updatePaletteSymbols = (palettes, dontToggleModal = false) => {
        if (palettes.length === 0) {
            alertWarning(
                Locales.strings.no_palettes_chosen_warning,
                Locales.strings.warning,
            );
            return;
        }
        this.props.setTempPalettes(palettes);
        if (!dontToggleModal) {
            this.props.toggleModals([PALETTE_UPDATE_CHOOSER]);
        }
        this.props.updateProblemSetPayload(
            { palettes },
            Locales.strings.updated_palettes,
            Locales.strings.unable_to_update_palettes,
        );
    }

    saveProblemSet = (orderedProblems, title) => {
        googleAnalytics(Locales.strings.add_problem_set);
        this.props.saveProblemSet(orderedProblems, title);
    };

    saveProblem = goTo => new Promise((resolve) => {
        if (this.props.example) {
            this.props.updateProblemStore({
                editLink: Locales.strings.example_edit_code,
            });
            resolve(true);
        } else {
            googleAnalytics('Save Problem');
            this.props.commitProblemSolution(goTo);
        }
    });

    finishProblem = () => {
        this.props.commitProblemSolution('back', false, true);
        googleAnalytics('Finish Problem');
    };

    saveProblemCallback = goTo => () => {
        this.props.toggleModals([CONFIRMATION_BACK]);
        this.saveProblem(goTo);
    };

    isEdited = () => {
        const { problemStore, problemList } = this.props;
        if (window.location.hash.startsWith('#/app/problem/view/')) {
            return false;
        }
        let editorPosition = problemStore.solution.steps.length - 1;
        let editorStep = null;
        if (problemStore.editing) {
            editorPosition = problemStore.editorPosition;
            editorStep = problemStore.stepsFromLastSave.find(step => step.inProgress);
        } else if (problemStore.stepsFromLastSave.length > 0) {
            editorStep = problemStore.stepsFromLastSave.slice()[editorPosition] || null;
        }

        const stepDiff = !compareStepArrays(
            problemStore.solution.steps,
            problemStore.stepsFromLastSave,
        );
        if (stepDiff) {
            return true;
        }
        const textAreaUpdated = (
            problemStore.textAreaValue && (
                !editorStep || editorStep.explanation !== problemStore.textAreaValue
            )
        );
        if (textAreaUpdated) {
            return true;
        }
        const mathFieldLatex = (
            problemStore.theActiveMathField || problemList.theActiveMathField
        ).$latex();
        const stepChanged = (
            editorStep
            && mathFieldLatex !== editorStep.stepValue);
        if (stepChanged) {
            return true;
        }
        return false;
    }

    goBack = (isModal, link) => () => {
        let allProblemsUrl = this.findGoBackUrl();
        if (isModal === true) {
            this.props.toggleModals([CONFIRMATION_BACK]);
            if (link) {
                allProblemsUrl = link;
            }
        } else if (!this.props.example && this.isEdited()) {
            this.props.toggleModals([CONFIRMATION_BACK], null, allProblemsUrl);
            return;
        }

        if (allProblemsUrl) {
            if (isModal) {
                const { scratchPadPainterro } = this.props.problemStore.work;
                if (scratchPadPainterro) {
                    scratchPadPainterro.clear();
                }
            }
            this.props.history.replace(allProblemsUrl);
        } else {
            this.props.history.goBack();
        }
    };

    findGoBackUrl = () => {
        let allProblemsUrl = null;
        const url = window.location.hash;
        const isProblemSetEdit = /#\/app\/problemSet\/edit\/[A-Z0-9]*\/[0-9]*$/.exec(url);
        const isSolutionEdit = /#\/app\/problem\/edit\/[A-Z0-9]*$/.exec(url);
        const isReview = /#\/app\/problem\/view\/[A-Z0-9]*$/.exec(url);
        if (isProblemSetEdit) {
            allProblemsUrl = /#\/app\/problemSet\/edit\/[A-Z0-9]*/.exec(url)[0].split('#')[1];
        } else if (isSolutionEdit) {
            const { set } = this.props.problemList;
            allProblemsUrl = `/app/problemSet/solve/${set.editCode}`;
        } else if (isReview) {
            const { solution } = this.props.problemStore;
            allProblemsUrl = `/app/problemSet/review/${solution.reviewCode}`;
        }
        return allProblemsUrl;
    }

    getAdditionalClass = () => {
        if (window.location.hash && ['#/signin', '#/signup', '#/userdetails'].indexOf(window.location.hash.toLowerCase()) > -1) {
            return 'full-height dark-background';
        }
        return '';
    };

    disableHotKeyModal = () => this.setState({ showDialog: false })

    getClassFromUserConfig = () => {
        const { userProfile } = this.props;
        const uiConfig = userProfile.config && userProfile.config.ui;
        const classList = [];
        if (uiConfig) {
            if (uiConfig.font) {
                classList.push(`userConfig-font-${configClassMap.font[uiConfig.font]}`);
            }
            if (typeof (uiConfig.letterSpacing) === 'number') {
                classList.push(`userConfig-letterSpacing-${uiConfig.letterSpacing}`);
            }
            if (typeof (uiConfig.lineHeight) === 'number') {
                classList.push(`userConfig-lineHeight-${uiConfig.lineHeight}`);
            }
        }
        return classList.join(' ');
    }

    renderDialog = () => {
        if (this.state.showDialog) {
            const { filter } = this.state;

            const updatedKeyMap = {
                ...keyMap,
                CLOSE_DIALOG: {
                    name: 'Close keymap',
                    sequences: [{
                        sequence: 'Escape',
                    }],
                    action: 'keyup',
                },
            };

            return (
                <GlobalHotKeys
                    keyMap={updatedKeyMap}
                    handlers={this.handlers}
                    allowChanges
                >
                    <div
                        role="button"
                        className="keymap-dialog"
                        onClick={this.disableHotKeyModal}
                        onKeyPress={passEventForKeys(this.disableHotKeyModal)}
                        tabIndex={0}
                    >
                        <h2>
                            {Locales.strings.keyboard_shortcuts}
                        </h2>

                        <ObserveKeys only="Escape">
                            <input
                                onChange={
                                    ({ target: { value } }) => this.setState({ filter: value })
                                }
                                onClick={e => stopEvent(e)}
                                value={filter}
                                placeholder={Locales.strings.filter}
                            />
                        </ObserveKeys>

                        <table>
                            <tbody>
                                {Object.keys(updatedKeyMap).reduce((memo, actionName) => {
                                    if (!filter
                                        || actionName.indexOf(filter.toUpperCase()) !== -1
                                        || (
                                            updatedKeyMap[actionName].name
                                            && updatedKeyMap[actionName].name.toUpperCase().indexOf(
                                                filter.toUpperCase(),
                                            ) !== -1)) {
                                        const { sequences, name } = updatedKeyMap[actionName];

                                        memo.push(
                                            <tr key={name || actionName}>
                                                <td className="keymap-tablecell">
                                                    {name}
                                                </td>
                                                <td className="keymap-tablecell">
                                                    {sequences.map(
                                                        ({ sequence }, index) => (
                                                            <span key={sequence}>
                                                                {sequence}
                                                                {(index === (sequences.length - 1) ? '' : ',')}
                                                            </span>
                                                        ),
                                                    )}
                                                </td>
                                            </tr>,
                                        );
                                    }

                                    return memo;
                                }, [])}
                            </tbody>
                        </table>
                    </div>
                </GlobalHotKeys>
            );
        }
        return null;
    }

    render() {
        const commonProps = this.props;
        const {
            modal, problemList, problemStore, userProfile,
        } = this.props;
        const { email, name } = userProfile;
        const { userType, role, grades } = userProfile.info;

        if (userProfile.checking) {
            return null;
        }

        const intercomAttributes = {
            user_id: email,
            email,
            name,
            userType: getFormattedUserType(userType),
            userRole: role,
            grades: grades && grades.join(','),
        };
        return (
            <React.Fragment>
                <Helmet
                    onChangeClientState={(newState) => {
                        this.props.changeTitle(newState.title);
                    }}
                />
                <div id="contentContainer" className={this.getClassFromUserConfig()}>
                    {this.renderDialog()}
                    <GlobalHotKeys keyMap={keyMap} handlers={this.handlers} allowChanges />
                    <ToastContainer />
                    <div className={`body-container ${this.getAdditionalClass()}`}>
                        <ModalContainer
                            activeModals={modal.activeModals}
                            link={modal.link}
                            toggleModals={this.props.toggleModals}
                            updateProblemSetTitle={this.props.updateProblemSetTitle}
                            progressToAddingProblems={this.progressToAddingProblems}
                            deleteProblem={this.deleteProblem}
                            shareLink={problemStore.shareLink}
                            newSetShareLink={`${FRONTEND_URL_PROTO}/app/problemSet/view/${problemList.newSetSharecode}`}
                            problemSetShareLink={`${FRONTEND_URL_PROTO}/app/problemSet/review/${problemList.problemSetShareCode}`}
                            activateMathField={field => this.props.setActiveMathField(field)}
                            theActiveMathField={problemList.theActiveMathField}
                            addProblemCallback={this.addProblem}
                            problems={problemList.set.problems}
                            tempSet={problemList.tempSet}
                            saveProblemSet={this.saveProblemSet}
                            saveProblems={this.props.saveProblems}
                            problemToEdit={problemList.problemToEdit}
                            editProblemCallback={this.editProblem}
                            history={this.props.history}
                            updateTempSet={this.props.updateTempSet}
                            updateProblemStore={this.props.updateProblemStore}
                            currentPalettes={problemList.set.palettes}
                            mathPalettes={problemList.set.palettes}
                            problemList={this.props.problemList}
                            submitToPartner={this.props.submitToPartner}
                            announceOnAriaLive={this.props.announceOnAriaLive}
                            clearAriaLive={this.props.clearAriaLive}
                            {...problemStore}
                            {...this}
                        />
                        <Switch>
                            <Route
                                exact
                                path="/app/problemSet/:action/:code?"
                                render={p => <Home {...commonProps} {...p} {...this} />}
                            />
                            <Route
                                exact
                                path="/app/problemSet/:action/:code/:position"
                                render={p => <Editor {...commonProps} {...p} {...this} />}
                            />
                            <Route
                                exact
                                path="/app/problem/:action/:code"
                                render={p => <Editor {...commonProps} {...p} {...this} />}
                            />
                            <Route
                                exact
                                path="/app/problem/example"
                                render={p => <Editor example {...commonProps} {...p} {...this} />}
                            />
                            <Route
                                exact
                                path="/app"
                                render={p => <PageIndex {...commonProps} {...p} {...this} />}
                            />
                            <Route
                                exact
                                path="/app/archived"
                                render={p => <PageIndex archiveMode="archived" {...commonProps} {...p} {...this} />}
                            />
                            <Route
                                exact
                                path="/"
                                render={(p) => {
                                    const signedIn = userProfile && userProfile.email;
                                    if (!signedIn && window.location.host === 'mathshare.benetech.org') {
                                        window.location.href = 'https://mathshare.benetech.org/cms';
                                        return null;
                                    }
                                    return (
                                        <LandingPage
                                            {...p}
                                            setAuthRedirect={this.props.setAuthRedirect}
                                            userProfile={this.props.userProfile}
                                        />
                                    );
                                }}
                            />
                            <Route exact path="/privacy" render={p => <Privacy {...p} />} />
                            <Route exact path="/getting-started" render={p => <GettingStarted {...p} />} />
                            <Route exact path="/partners" render={p => <Partners {...p} />} />
                            <Route exact path="/signIn" render={p => <SignIn {...p} />} />
                            <Route exact path="/signUp" render={p => <SignIn {...p} isSignUp />} />
                            <Route exact path="/userDetails" render={p => <UserDetails {...p} />} />
                            <Route render={p => <NotFound {...p} />} />
                        </Switch>
                    </div>
                    {['teacher', 'other'].includes(userType) && <Intercom {...intercomAttributes} appID={process.env.INTERCOM_APP_ID} />}
                    <footer id="footer">
                        <h2 className="sROnly">
                            {' '}
                            {Locales.strings.footer}
                            {' '}
                        </h2>
                        {window.location.hash === '#/' && <SiteMapFooter />}
                        <MainPageFooter customClass="footer" />
                        <SocialFooter />
                    </footer>
                </div>
                <AriaLiveAnnouncer />
            </React.Fragment>
        );
    }
}

export default withRouter(connect(
    state => ({
        problemList: state.problemList,
        problemStore: state.problem,
        userProfile: state.userProfile,
        modal: state.modal,
        routerHooks: state.routerHooks,
    }),
    {
        ...problemActions,
        ...problemListActions,
        ...userProfileActions,
        ...ariaLiveAnnouncerActions,
        ...routerActions,
        ...uiActions,
    },
)(App));
