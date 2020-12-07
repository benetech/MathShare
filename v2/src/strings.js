import LocalizedStrings from 'react-localization';

class Locales {
    constructor() {
        this.strings = new LocalizedStrings({
            en: {
                archive: 'Archive',
                archived_problem_set: 'Archived Problem Set - {title}',
                archived_problem_set_failure: 'Failed to archive Problem Set - {title}',
                archived_sets: 'Archived Sets',
                archived_sets_empty: 'No Archived Sets',
                archived_solutiom_set: 'Archived Solution Set - {title}',
                archived_solutiom_set_failure: 'Failed to archive Solution Set - {title}',
                back: 'Go back',
                back_2: 'Back',
                back_to_all_sets: 'Back to All Sets',
                back_to_problem_set: 'Back to \'{title}\' set',
                benefits_of_logging_in: 'Benefits of logging in',
                benefits_of_signing_up: 'Benefits of signing up',
                cancel: 'Cancel',
                choose_one: 'Choose one',
                continue_without_signing_in: 'Continue to Mathshare without logging in',
                continue_without_signing_up: 'Continue to Mathshare without signing up',
                delete: 'Delete',
                delete_confirmation: 'This will permanently delete the problem set.',
                describe_your_role: 'Which best describes your role?',
                describe_your_work: 'Describe your work',
                disability: 'Do you have a disability or difficulties related to:',
                duplicate: 'Duplicate',
                failure: 'Failure',
                finish: 'Finish',
                gender: 'Gender',
                google: 'Google',
                grade: 'Grade',
                grade_and_role_warning: 'Please make sure a grade and role is selected',
                grade_of_study: 'What grade do you study in',
                grade_of_work: 'What grade do you work with?',
                info: 'Info',
                login_using: 'Log in using',
                mathshare_benetech: 'Benetech Mathshare',
                mathshare_logo: 'Mathshare Logo, a Benetech Initiative',
                ms: 'Microsoft',
                next: 'Next',
                okay: 'Okay',
                only_fill_if_in_us: 'Only fill out if in the U.S.',
                other: 'Other',
                please_check_account_info: 'Please check through your account information to make sure it\'s accurate',
                problem_saved_success_message: 'Problem Updated',
                profile_of_mathshare: 'Profile of Mathshare',
                profile_of_username: 'Profile of {userName}',
                redirecting: 'Redirecting',
                redirecting_to_fill: 'Redirecting to fill your information',
                redirecting_to_review: 'Redirecting to review your information',
                restore: 'Restore',
                restore_success: 'Restored Problem Set - {title}',
                review_account_info: 'Review Account Info',
                setup_your_account: "Let's setup your account",
                sign_in: 'Log in',
                sign_out: 'Sign Out',
                sign_up: 'Sign up',
                sign_up_using: 'Sign up using',
                student: 'Student',
                success: 'Success',
                teacher: 'Teacher',
                user_profile: 'User Profile',
                where_are_you_from: 'Where are you from?',
                who_are_you: 'Who are you?',
                year_of_birth: 'Year of Birth',
            },
            es: {},
        });
    }
}

export default (new Locales());
