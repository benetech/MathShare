import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { displayAlert } from '../../services/alerts';
import Locales from '../../strings';
import { redirectAfterLogin, saveUserInfo, saveUserInfoPayload } from '../../redux/userProfile/actions';
import { announceOnAriaLive } from '../../redux/ariaLiveAnnouncer/actions';
import userDetails from './styles.scss';

class UserDetails extends Component {
    constructor(props) {
        super(props);
        this.grades = ['K-5', '6-8', '9-12', '13+', 'none'];
        this.userTypes = [
            {
                label: Locales.strings.teacher,
                value: 'teacher',
            },
            {
                label: Locales.strings.student,
                value: 'student',
            },
            {
                label: Locales.strings.other,
                value: 'other',
            },
        ];
        const gradeMap = {};
        this.grades.forEach((grade) => {
            gradeMap[grade] = false;
        });
        this.roles = ['Teacher', 'Technology Coach', 'Media Specialist', 'Special Education', 'Educator', 'Curriculum', 'Developer', 'Administrator'];
        this.studentGrades = [
            'Prefer Not to Say',
            'Kindergarten',
            '1st',
            '2nd',
            '3rd',
            '4th',
            '5th',
            '6th',
            '7th',
            '8th',
            '9th',
            '10th',
            '11th',
            '12th',
            '13th+',
        ];
        this.disabilities = [
            'Hearing math',
            'Seeing or reading math',
            'Writing math',
            'Anxiety about math',
            'Focusing on or organizing your math work',
            'Speaking or communicating math',
        ];
        this.state = {
            userType: (props.userProfile.info.userType) || 'teacher',
            typeConfirmed: false,
            county: '',
            zipcode: '',
            role: '',
            yearOfBirth: '',
            grade: '',
            gradeStatus: gradeMap,
            step: 0,
            disability: '',
            disabilities: [],
            errors: {},
        };
    }

    addErrorClass = (name) => {
        if (this.state.errors[name]) {
            return 'is-invalid';
        }
        return '';
    }

    back = () => {
        this.setState(prevState => ({
            step: prevState.step - 1,
            errors: {},
        }));
    }

    next = () => {
        const errors = {};
        if (this.state.step === 1) {
            if (!this.state.grade) {
                errors.grade = 'required';
            }
            if (!this.state.yearOfBirth) {
                errors.yearOfBirth = 'required';
            }
            if (!this.state.gender) {
                errors.gender = 'required';
            }
        }
        if (Object.keys(errors).length > 0) {
            this.setState({
                errors,
            });
            return;
        }
        if (this.state.step === 2) {
            this.finish();
            return;
        }
        this.setState(prevState => ({
            step: prevState.step + 1,
            errors: {},
        }));
    }

    finish = () => {
        const {
            role, gradeStatus, userType, otherDisability,
        } = this.state;
        if (userType === 'student') {
            if (otherDisability && otherDisability.length > 255) {
                return;
            }
            const payload = {
                ...this.state,
            };
            if (payload.gender === 'na') {
                payload.gender = null;
            }
            if (payload.grade === 'na') {
                payload.grade = null;
            }
            if (payload.yearOfBirth === 'na') {
                payload.yearOfBirth = null;
            }
            this.props.saveUserInfoPayload(payload);
        } else if (userType === 'other') {
            this.props.saveUserInfo(userType, [], '');
        } else if (userType === 'teacher') {
            if (Object.values(gradeStatus).filter(value => value).length === 0) {
                displayAlert('warning', Locales.strings.grade_and_role_warning);
                return;
            }
            const grades = Object.keys(gradeStatus).filter(gradeName => gradeStatus[gradeName]);
            this.props.saveUserInfo(userType, grades, role);
        }
        this.props.redirectAfterLogin();
    }

    handleChange = key => (event) => {
        event.persist();
        const target = event.target;
        const value = target.value;

        this.setState({
            [key]: value,
        }, () => {
            if (key === 'otherDisability') {
                this.handleDisabilityChange(value)(event, true);
            }
        });
    }

    handleDisabilityChange = disability => (event, add) => {
        if (!disability) {
            return;
        }
        const excapedDisability = disability.replace(/\|/g, '');
        const target = event.target;
        const remove = (!target || !target.checked) && !add;
        this.setState((prevState) => {
            const existingDisabilities = prevState.disabilities
                .filter(currentDisability => (
                    currentDisability && (
                        !remove || currentDisability.trim() !== excapedDisability.trim()
                    ) && (
                        !add || this.disabilities.includes(currentDisability)
                    )
                )).slice();

            if (!remove) {
                if (existingDisabilities.includes(excapedDisability) && !remove) {
                    return prevState;
                }
                existingDisabilities.push(excapedDisability);
            }

            return {
                ...prevState,
                disabilities: existingDisabilities.sort(),
                disability: existingDisabilities.sort().join('|'),
            };
        });
    }

    confirmType = () => {
        this.setState({ step: 1 }, () => {
            const { userType } = this.state;
            if (userType === 'other') {
                this.finish();
            } else if (userType === 'teacher') {
                const gradeHeading = document.getElementById('gradeOfWork');
                if (gradeHeading) {
                    gradeHeading.focus();
                }
                this.props.announceOnAriaLive(Locales.strings.grade_of_work);
            } else if (userType === 'student') {
                const gradeHeading = document.getElementById('studentGrade');
                if (gradeHeading) {
                    gradeHeading.focus();
                }
                this.props.announceOnAriaLive(Locales.strings.grade_of_study);
            }
        });
    }

    handleUserTypeChange = (event) => {
        const target = event.target;
        const value = target.value;

        this.setState({ userType: value });
    }

    handleOtherDisabilityToggle = (e) => {
        const { target } = e;
        if (target.checked) {
            this.setState({
                otherDisabilityEnabled: true,
                otherDisability: '',
            });
            this.handleDisabilityChange(this.state.otherDisability)(e);
        } else {
            this.setState((prevState) => {
                const disabilities = prevState.disabilities
                    .filter(disability => this.disabilities.includes(disability)).sort();
                return {
                    ...prevState,
                    otherDisabilityEnabled: false,
                    otherDisability: '',
                    disability: disabilities.join('|'),
                    disabilities,
                };
            });
        }
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

    renderStudentFormPage1 = () => (
        <div className={userDetails.teacherForm}>
            <div className="row">
                <div className={`${userDetails.descText} col-5`}>
                    <label htmlFor="studentGrade">
                        <h2 tabIndex={-1}>{Locales.strings.grade}</h2>
                    </label>
                </div>
                <div className={`${userDetails.select} col-7`}>
                    <div className="form-group">
                        <select className={`form-control ${this.addErrorClass('grade')}`} id="studentGrade" onChange={this.handleChange('grade')} value={this.state.grade}>
                            <option value="">{Locales.strings.choose_one}</option>
                            {this.studentGrades.map(studentGrade => (
                                <option key={studentGrade}>
                                    {studentGrade}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className={`${userDetails.descText} col-5`}>
                    <label htmlFor="yearOfBirth">
                        <h2 tabIndex={-1}>{Locales.strings.year_of_birth}</h2>
                    </label>
                </div>
                <div className={`${userDetails.select} col-7`}>
                    <div className="form-group">
                        <select className={`form-control ${this.addErrorClass('yearOfBirth')}`} id="yearOfBirth" onChange={this.handleChange('yearOfBirth')} value={this.state.yearOfBirth}>
                            <option value="">{Locales.strings.choose_one}</option>
                            <option value="na">Prefer Not to Say</option>
                            {Array.from({ length: 121 }, (v, i) => 2020 - i).map(yearOfBirth => (
                                <option key={yearOfBirth}>
                                    {yearOfBirth}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className={`${userDetails.descText} col-5`}>
                    <label htmlFor="gender">
                        <h2 tabIndex={-1}>{Locales.strings.gender}</h2>
                    </label>
                </div>
                <div className={`${userDetails.select} col-7`}>
                    <div className="form-group">
                        <select className={`form-control ${this.addErrorClass('gender')}`} id="gender" onChange={this.handleChange('gender')} value={this.state.gender}>
                            <option value="">{Locales.strings.choose_one}</option>
                            <option value="na">Prefer Not to Say</option>
                            <option key="male" value="male">
                                Male
                            </option>
                            <option key="female" value="female">
                                Female
                            </option>
                            <option key="other" value="other">
                                Other
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className={`${userDetails.descText} col-5`}>
                    <label htmlFor="county">
                        <h2 tabIndex={-1}>{Locales.strings.where_are_you_from}</h2>
                        <p>
                            *
                            {Locales.strings.only_fill_if_in_us}
                        </p>
                    </label>
                </div>
                <div className={`${userDetails.select} col-7`}>
                    <div className="form-group">
                        <input className="form-control" type="text" name="county" id="county" placeholder="County" onChange={this.handleChange('county')} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="text" name="zipcode" id="zipcode" placeholder="Zip Code" onChange={this.handleChange('zipcode')} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-3" />
                <button
                    className={`btn btn-primary col-4 ${userDetails.smallBtn}`}
                    id="backBtn"
                    type="button"
                    onClick={this.back}
                >
                    {Locales.strings.back.trim()}
                </button>
                <div className="col-1" />
                <button
                    className={`btn btn-primary col-4 ${userDetails.smallBtn}`}
                    id="nextBtn"
                    type="button"
                    onClick={this.next}
                >
                    {Locales.strings.next.trim()}
                </button>
            </div>
        </div>
    )

    renderStudentFormPage2 = () => (
        <div className={userDetails.studentForm}>
            <div className="row">
                <div className={`${userDetails.descText} col-12`}>
                    <label htmlFor="studentGrade">
                        <h2 tabIndex={-1}>{Locales.strings.disability}</h2>
                    </label>
                </div>
                <div className={`${userDetails.disabilities} col-12`}>
                    {this.disabilities.map((disability, disabilityIndex) => (
                        <div className="form-group" key={`disability-${disabilityIndex}`}>
                            <label className="radio-inline" htmlFor={`disability-${disabilityIndex}`} id={`label-disability-${disabilityIndex}`}>
                                <input id={`disability-${disabilityIndex}`} type="checkbox" onChange={this.handleDisabilityChange(disability)} />
                                {' '}
                                {disability}
                            </label>
                        </div>
                    ))}
                    <div className="form-group form-inline" key="disability-other">
                        <label className="radio-inline" htmlFor="disability-otherDisability" id="label-disability-otherDisability">
                            <input
                                id="disability-otherDisability"
                                type="checkbox"
                                onChange={this.handleOtherDisabilityToggle}
                            />
                            {' '}
                            <input
                                className={`form-control ${this.state.otherDisability && this.state.otherDisability.length > 255 ? 'is-invalid' : ''}`}
                                type="text"
                                name="otherDisability"
                                id="otherDisability"
                                disabled={!this.state.otherDisabilityEnabled}
                                placeholder={Locales.strings.other}
                                onChange={this.handleChange('otherDisability')}
                                value={this.state.otherDisability}
                            />
                            <div className="invalid-feedback">
                                Max length is 255
                            </div>
                        </label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-3" />
                <button
                    className={`btn btn-primary col-4 ${userDetails.smallBtn}`}
                    id="backBtn"
                    type="button"
                    onClick={this.back}
                >
                    {Locales.strings.back.trim()}
                </button>
                <div className="col-1" />
                <button
                    className={`btn btn-primary col-4 ${userDetails.smallBtn}`}
                    id="finishBtn"
                    type="button"
                    onClick={this.next}
                >
                    {Locales.strings.finish.trim()}
                </button>
            </div>
        </div>
    )

    renderStudentForm = () => {
        if (this.state.step === 1) {
            return this.renderStudentFormPage1();
        }
        return this.renderStudentFormPage2();
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
                        <select className="form-control" id="teacherRole" onChange={this.handleChange('role')} value={this.state.role}>
                            <option value="">{Locales.strings.choose_one}</option>
                            {this.roles.map(role => (
                                <option key={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
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
            </div>
        </div>
    )

    render() {
        const { editDetailsPage } = this.props;
        return (
            <div className={userDetails.container}>
                <Helmet>
                    <title>
                        {`${editDetailsPage ? Locales.strings.review_account_info : Locales.strings.setup_your_account} - ${Locales.strings.mathshare_benetech}`}
                    </title>
                </Helmet>
                <div className={userDetails.content}>
                    <header className={userDetails.logo}>
                        <img src="https://mathshare-qa.diagramcenter.org/images/logo-black.png" alt={Locales.strings.mathshare_logo} />
                    </header>
                    <main id="mainContainer">
                        <h1 className={userDetails.text} tabIndex={-1}>
                            {editDetailsPage
                                ? Locales.strings.review_account_info
                                : Locales.strings.setup_your_account
                            }
                        </h1>
                        {this.state.step === 0 && editDetailsPage && (
                            <h2 tabIndex={-1} className={userDetails.subHeading}>
                                {Locales.strings.please_check_account_info}
                            </h2>
                        )}
                        {this.state.step === 0 && (
                            <>
                                <div className={`${userDetails.userType} row`}>
                                    <div className={`${userDetails.descText} col-5`}>
                                        <label htmlFor="who_are_you">
                                            <h2 tabIndex={-1}>{Locales.strings.who_are_you}</h2>
                                        </label>
                                    </div>
                                    <div className={`${userDetails.userTypeSelect} col-7`}>
                                        <div className="form-group">
                                            <select className="form-control" id="who_are_you" onChange={this.handleUserTypeChange} value={this.state.userType}>
                                                {this.userTypes.map(userType => (
                                                    <option
                                                        key={userType.value}
                                                        value={userType.value}
                                                    >
                                                        {userType.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-5" />
                                    <button
                                        className={`btn btn-primary col-7 ${userDetails.smallBtn} ${userDetails.confirmBtn}`}
                                        id="confirmBtn"
                                        type="button"
                                        onClick={this.confirmType}
                                    >
                                        {Locales.strings.next}
                                    </button>
                                </div>
                            </>
                        )}
                        {this.state.step !== 0 && this.state.userType === 'teacher' && this.renderTeacherForm()}
                        {this.state.step !== 0 && this.state.userType === 'student' && this.renderStudentForm()}
                    </main>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(
    state => ({
        userProfile: state.userProfile,
    }),
    {
        redirectAfterLogin,
        saveUserInfo,
        saveUserInfoPayload,
        announceOnAriaLive,
    },
)(UserDetails));
