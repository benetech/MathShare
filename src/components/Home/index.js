import React, { Component } from 'react';
import { NotificationContainer } from 'react-notifications';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MainPageHeader from './components/Header';
import NavigationHeader from './components/Navigation/Header';
import NavigationProblems from './components/Navigation/Problems';
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
        this.props.requestProblemSet(action, code);
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

    render() {
        const {
            match,
            problemList,
        } = this.props;
        const {
            params,
        } = match;
        if (problemList.notFound) {
            return <NotFound />;
        }
        return (
            <div className={home.mainWrapper}>
                <NotificationContainer />
                <MainPageHeader
                    editing={params.action === 'edit'}
                    history={this.props.history}
                    addProblemSetCallback={this.props.addProblemSet}
                    finishEditing={this.props.finishEditing}
                    editCode={problemList.set.editCode}
                    action={params.action}
                />
                <main id="LeftNavigation" className={home.leftNavigation}>
                    {params.action !== 'review' && (
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
                            </div>
                        </div>
                    )}
                    <NavigationHeader set={problemList.set} />
                    <NavigationProblems
                        problems={problemList.set.problems}
                        editing={params.action === 'edit'}
                        activateModals={this.props.toggleModals}
                        updatePositions={this.props.updatePositions}
                        action={params.action}
                        code={params.code}
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
