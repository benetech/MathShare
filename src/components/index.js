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
import AriaLiveAnnouncer from './AriaLiveAnnouncer';
import MainPageFooter from './Home/components/Footer';
import SocialFooter from './Home/components/SocialFooter';
import SiteMapFooter from './Home/components/SiteMapFooter';
import Locales from '../strings';
import ModalContainer, {
    CONFIRMATION,
    CONFIRMATION_BACK,
    PALETTE_CHOOSER, // ADD_PROBLEM_SET,
    EDIT_PROBLEM,
    SHARE_SET,
    VIEW_SET,
} from './ModalContainer';
import { alertWarning } from '../scripts/alert';
import googleAnalytics from '../scripts/googleAnalytics';
import { FRONTEND_URL } from '../config';
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


const mathLive = process.env.MATHLIVE_DEBUG_MODE
    ? require('../../mathlive/src/mathlive.js').default
    : require('../lib/mathlivedist/mathlive.js');

configure({
    // logLevel: 'verbose',
    ignoreEventsCondition: () => false,
    ignoreKeymapAndHandlerChangesByDefault: false,
});

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
            if (e.target.className.indexOf('dropdown-item') === -1) {
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
        this.props.toggleModals([PALETTE_CHOOSER]);
        googleAnalytics('new problem set button');
        IntercomAPI('trackEvent', 'create-a-set');
    };

    progressToAddingProblems = (palettes) => {
        if (palettes.length === 0) {
            alertWarning(
                Locales.strings.no_palettes_chosen_warning,
                Locales.strings.warning,
            );
            return;
        }
        this.props.setTempPalettes(palettes);
        // this.props.toggleModals([PALETTE_CHOOSER, ADD_PROBLEM_SET]);
        this.props.toggleModals([PALETTE_CHOOSER]);
        this.props.history.push('/app/problemSet/new');
        this.props.saveProblemSet([], `${Locales.strings.new_problem_set} ${dayjs().format('MM-DD-YYYY')}`, null);
    }

    saveProblemSet = (orderedProblems, title) => {
        googleAnalytics(Locales.strings.add_problem_set);
        this.props.saveProblemSet(orderedProblems, title);
    };

    saveProblem = () => new Promise((resolve) => {
        if (this.props.example) {
            this.props.updateProblemStore({
                editLink: Locales.strings.example_edit_code,
            });
            resolve(true);
        } else {
            googleAnalytics('Save Problem');
            this.props.commitProblemSolution();
        }
    });

    finishProblem = () => {
        this.props.commitProblemSolution(true);
    };

    shareProblem = () => {
        if (this.props.example) {
            this.props.updateProblemStore({
                shareLink: Locales.strings.example_share_code,
            });
            this.props.toggleModals([SHARE_SET]);
        } else {
            googleAnalytics('Share Problem');
            this.props.updateProblemSolution(this.props.problemStore.solution);
            this.props.commitProblemSolution(false, true);
        }
    };

    viewProblem = () => {
        this.props.toggleModals([VIEW_SET]);
    };

    saveProblemCallback = () => {
        this.props.toggleModals([CONFIRMATION_BACK]);
        this.saveProblem();
    };

    goBack = () => {
        const { problemStore } = this.props;
        if (
            !compareStepArrays(
                problemStore.solution.steps,
                problemStore.stepsFromLastSave,
            )
            && !this.props.example
        ) {
            this.props.toggleModals([CONFIRMATION_BACK]);
        } else {
            this.props.history.goBack();
        }
    };

    getAdditionalClass = () => {
        if (window.location.hash && ['#/signin', '#/userdetails'].indexOf(window.location.hash.toLowerCase()) > -1) {
            return 'full-height dark-background';
        }
        return '';
    };

    disableHotKeyModal = () => this.setState({ showDialog: false })

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
        const { modal, problemList, problemStore } = this.props;
        return (
            <React.Fragment>
                <Helmet
                    onChangeClientState={(newState) => {
                        this.props.changeTitle(newState.title);
                    }}
                />
                {this.renderDialog()}
                <GlobalHotKeys keyMap={keyMap} handlers={this.handlers} allowChanges />
                <ToastContainer />
                <div className={`body-container ${this.getAdditionalClass()}`}>
                    <ModalContainer
                        activeModals={modal.activeModals}
                        toggleModals={this.props.toggleModals}
                        updateProblemSetTitle={this.props.updateProblemSetTitle}
                        progressToAddingProblems={this.progressToAddingProblems}
                        deleteProblem={this.deleteProblem}
                        shareLink={problemStore.shareLink}
                        newSetShareLink={`${FRONTEND_URL}/app/problemSet/view/${problemList.newSetSharecode}`}
                        problemSetShareLink={`${FRONTEND_URL}/app/problemSet/review/${problemList.problemSetShareCode}`}
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
                            path="/"
                            render={p => (
                                <LandingPage
                                    {...p}
                                    setAuthRedirect={this.props.setAuthRedirect}
                                    userProfile={this.props.userProfile}
                                />
                            )}
                        />
                        <Route exact path="/privacy" render={p => <Privacy {...p} />} />
                        <Route exact path="/partners" render={p => <Partners {...p} />} />
                        <Route exact path="/signIn" render={p => <SignIn {...p} />} />
                        <Route exact path="/userDetails" render={p => <UserDetails {...p} />} />
                        <Route render={p => <NotFound {...p} />} />
                    </Switch>
                </div>
                <Intercom appID={process.env.INTERCOM_APP_ID} />
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
