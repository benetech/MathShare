import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
import { alertWarning } from '../../scripts/alert';
import Locales from '../../strings';
import { redirectAfterLogin, saveUserInfo } from '../../redux/userProfile/actions';
import { announceOnAriaLive } from '../../redux/ariaLiveAnnouncer/actions';
import logo from '../../../images/logo-black.png';
import userDetails from './styles.scss';
import SkipContent from '../Home/components/SkipContent';


class UserDetails extends Component {
    constructor(props) {
        super(props);
        this.grades = ['K-5', '6-8', '9-12', '13+', 'none'];
        const gradeMap = {};
        this.grades.forEach((grade) => {
            gradeMap[grade] = false;
        });
        this.roles = ['Teacher', 'Technology Coach', 'Media Specialist', 'Special Education', 'Educator', 'Curriculum', 'Developer', 'Administrator'];
        this.state = {
            type: null,
            role: '',
            gradeStatus: gradeMap,
        };
    }

    setType = type => () => {
        this.setState({ type }, () => {
            if (type === 'student') {
                this.finish();
            }
            if (type === 'teacher') {
                const gradeHeading = document.getElementById('gradeOfWork');
                if (gradeHeading) {
                    gradeHeading.focus();
                }
                this.props.announceOnAriaLive(Locales.strings.grade_of_work);
            }
        });
    }

    finish = () => {
        const { role, gradeStatus, type } = this.state;
        if (type === 'student') {
            this.props.saveUserInfo(type, [], '');
        } else if (type === 'teacher') {
            if (Object.values(gradeStatus).filter(value => value).length === 0) {
                alertWarning(Locales.strings.grade_and_role_warning);
                return;
            }
            const grades = Object.keys(gradeStatus).filter(gradeName => gradeStatus[gradeName]);
            this.props.saveUserInfo(type, grades, role);
        }
        this.props.redirectAfterLogin();
    }

    handleRoleChange = (event) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            role: value,
        });
    }

    handleGradeChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState(prevState => ({
            gradeStatus: {
                ...prevState.gradeStatus,
                [name]: value,
            },
        }));
    }

    renderTeacherForm = () => (
        <div className={userDetails.teacherForm}>
            <fieldset className="row">
                <legend className={`${userDetails.descText} col-5`}>
                    <h2 tabIndex={-1} id="gradeOfWork">{Locales.strings.grade_of_work}</h2>
                </legend>
                <div className={`${userDetails.grade} col-7`}>
                    {this.grades.map((grade) => {
                        const id = `grade-${grade.replace('-', '').replace('+', '')}`;
                        return (
                            <React.Fragment key={id}>
                                <label className="radio-inline" htmlFor={id} id={`label-${id}`}>
                                    <input type="checkbox" name={grade} id={id} checked={this.state.gradeStatus[grade]} onChange={this.handleGradeChange} />
                                    {grade}
                                </label>
                                <UncontrolledTooltip placement="top" target={`label-${id}`} />
                            </React.Fragment>
                        );
                    })}
                </div>
            </fieldset>
            <div className="row">
                <div className={`${userDetails.descText} col-5`}>
                    <label htmlFor="teacherRole">
                        <h2 tabIndex={-1}>{Locales.strings.describe_your_role}</h2>
                    </label>
                </div>
                <div className={`${userDetails.select} col-7`}>
                    <div className="form-group">
                        <select className="form-control" id="teacherRole" onChange={this.handleRoleChange} value={this.state.role}>
                            <option value="">{Locales.strings.choose_one}</option>
                            {this.roles.map(role => (
                                <option key={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                        <UncontrolledTooltip placement="top" target="teacherRole" />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-5" />
                <button
                    className={`btn btn-primary col-7 ${userDetails.smallBtn}`}
                    id="finishBtn"
                    type="button"
                    onClick={this.finish}
                >
                    {Locales.strings.finish.trim()}
                </button>
                <UncontrolledTooltip placement="top" target="finishBtn" />
            </div>
        </div>
    )

    render() {
        return (
            <div className={userDetails.container}>
                <Helmet>
                    <title>
                        {`${Locales.strings.setup_your_account} - ${Locales.strings.mathshare_benetech}`}
                    </title>
                </Helmet>
                <div className={userDetails.content}>
                    <header className={userDetails.logo}>
                        <SkipContent />
                        <img src={logo} alt={Locales.strings.mathshare_logo} />
                    </header>
                    <div id="mainContainer">
                        <h1 className={userDetails.text} tabIndex={-1}>
                            {Locales.strings.setup_your_account}
                        </h1>
                        {this.state.type === null && (
                            <fieldset className="row">
                                <legend className={userDetails.descText}>
                                    <h2 tabIndex={-1} id="who_are_you">{Locales.strings.who_are_you}</h2>
                                </legend>
                                <div className={userDetails.buttonsContainer}>
                                    <button
                                        className={`btn btn-primary ${userDetails.largeBtn}`}
                                        id="im_a_teacher"
                                        type="button"
                                        onClick={this.setType('teacher')}
                                    >
                                        {Locales.strings.i_m_teacher}
                                    </button>
                                    <UncontrolledTooltip placement="top" target="im_a_teacher" />
                                    <button
                                        className={`btn btn-primary ${userDetails.largeBtn}`}
                                        id="im_a_student"
                                        type="button"
                                        onClick={this.setType('student')}
                                    >
                                        {Locales.strings.i_m_student}
                                    </button>
                                    <UncontrolledTooltip placement="top" target="im_a_student" />
                                </div>
                            </fieldset>
                        )}
                        {this.state.type === 'teacher' && this.renderTeacherForm()}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(
    () => ({}),
    {
        redirectAfterLogin,
        saveUserInfo,
        announceOnAriaLive,
    },
)(UserDetails));
