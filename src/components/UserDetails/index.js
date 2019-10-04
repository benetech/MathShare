import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
import { alertWarning, alertSuccess } from '../../scripts/alert';
import Locales from '../../strings';
import { redirectAfterLogin, saveUserInfo } from '../../redux/userProfile/actions';
import logo from '../../../images/logo-black.png';
import userDetails from './styles.scss';


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
        alertSuccess(Locales.strings.thanks_for_details);
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
                    <h2 tabIndex={-1}>{Locales.strings.describe_your_role}</h2>
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
                <div className={userDetails.content}>
                    <div className={userDetails.logo}>
                        <img src={logo} alt={Locales.strings.mathshare_logo} />
                    </div>
                    <div className={userDetails.text}>{Locales.strings.setup_your_account}</div>
                    {this.state.type === null && (
                        <div className={userDetails.buttonsContainer}>
                            <div>
                                <button
                                    className={`btn btn-primary ${userDetails.largeBtn}`}
                                    id="im_a_teacher"
                                    type="button"
                                    onClick={this.setType('teacher')}
                                >
                                    {Locales.strings.i_m_teacher}
                                </button>
                            </div>
                            <div>
                                <button
                                    className={`btn btn-primary ${userDetails.largeBtn}`}
                                    id="im_a_student"
                                    type="button"
                                    onClick={this.setType('student')}
                                >
                                    {Locales.strings.i_m_student}
                                </button>
                            </div>
                            <UncontrolledTooltip placement="top" target="im_a_teacher" />
                            <UncontrolledTooltip placement="top" target="im_a_student" />
                        </div>
                    )}

                    {this.state.type === 'teacher' && this.renderTeacherForm()}
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
    },
)(UserDetails));
