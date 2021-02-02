import LocalizedStrings from 'react-localization';

class Locales {
    constructor() {
        this.strings = new LocalizedStrings({
            en: {
                about_mathshare: 'About Mathshare',
                accessibility: 'Accessibility',
                active: 'active',
                add_new_problem: 'Add New Problem',
                add_new_problem_disabled: 'Add New Problem (enter data in current problem to enable this)',
                add_step: 'Add Step',
                add_the_prompt: 'Add the prompt and any details here',
                allow_educators_to_duplicate: 'Allows eductators to duplicate and re-use this problem set',
                allow_students_to_see: 'Allows students to answer questions',
                allow_others_to_see: 'Allows others to see your work',
                archive: 'Archive',
                archived_problem_set: 'Archived Problem Set - {title}',
                archived_problem_set_failure: 'Failed to archive Problem Set - {title}',
                archived_sets: 'Archived Sets',
                archived_sets_empty: 'No Archived Sets',
                archived_solutiom_set: 'Archived Solution Set - {title}',
                archived_solutiom_set_failure: 'Failed to archive Solution Set - {title}',
                assign_problem_set: 'Assign Problem Set',
                assign_set: 'Assign Set',
                back: 'Go back',
                back_2: 'Back',
                back_to_all_sets: 'Back to All Sets',
                back_to_dashboard: 'Back to Dashboard',
                back_to_problem_set: 'Back to \'{title}\' set',
                benefits_of_logging_in: 'Benefits of logging in',
                benefits_of_signing_up: 'Benefits of signing up',
                cancel: 'Cancel',
                checkered_flag: 'checkered flag',
                choose_one: 'Choose one',
                confirm: 'Confirm',
                continue_without_signing_in: 'Continue to Mathshare without logging in',
                continue_without_signing_up: 'Continue to Mathshare without signing up',
                copy_link_url: ' Copy link',
                created_problem_set: 'Problem Set has been created',
                delete: 'Delete',
                delete_confirmation: 'This will permanently delete the problem set.',
                describe_your_role: 'Which best describes your role?',
                describe_your_work: 'Describe your work',
                desktop_view: 'Desktop View',
                disability: 'Do you have a disability or difficulties related to:',
                duplicate: 'Duplicate',
                example_sets: 'Example Sets',
                failure: 'Failure',
                failure_in_creating_problem_set: 'Failure in creating problem set',
                finish: 'Finish',
                finish_q: 'Finish?',
                finished_checkmark: 'Finished Checkmark',
                gender: 'Gender',
                google: 'Google',
                google_classroom: 'Google Classroom',
                grade: 'Grade',
                grade_and_role_warning: 'Please make sure a grade and role is selected',
                grade_of_study: 'What grade do you study in',
                grade_of_work: 'What grade do you work with?',
                help_center: 'Help Center',
                info: 'Info',
                load_more: 'Load More',
                loading: 'Loading...',
                login_using: 'Log in using',
                mathshare_benetech: 'Benetech Mathshare',
                mathshare_logo: 'Mathshare Logo, a Benetech Initiative',
                ms: 'Microsoft',
                ms_team: 'Microsoft Teams',
                my_created_sets: 'My Created Sets',
                my_sets: 'My Sets',
                my_solution_sets: 'My Solution Sets',
                my_steps: 'My Steps',
                next_problem: 'Next Problem, {currentIndex} is currently active',
                new_problem_set: 'New Problem Set',
                next: 'Next',
                no_steps_have_been_added: 'No steps have been added in this problem',
                okay: 'Okay',
                only_fill_if_in_us: 'Only fill out if in the U.S.',
                opens_in_new_tab: '(opens new tab)',
                other: 'Other',
                please_check_account_info: 'Please check through your account information to make sure it\'s accurate',
                previous_problem: 'Previous Problem, {currentIndex} is currently active',
                problem: 'Problem',
                problem_saved_success_message: 'Problem Updated',
                problem_set_cannot_be_duplicated: 'The problem set cannot be duplicated',
                profile_of_mathshare: 'Profile of Mathshare',
                profile_of_username: 'Profile of {userName}',
                redirecting: 'Redirecting',
                redirecting_to_fill: 'Redirecting to fill your information',
                redirecting_to_review: 'Redirecting to review your information',
                restore: 'Restore',
                restore_success: 'Restored Problem Set - {title}',
                review_account_info: 'Review Account Info',
                setup_your_account: "Let's setup your account",
                share_my_answers: 'Share My Answers',
                share_my_work: 'Share my work',
                share_on: 'Share on',
                share_problem_set: 'Share Problem Set',
                share_your_problem_set: 'Share your problem set through Google Classroom or Microsoft Teams, or share using the link below.',
                sign_in: 'Log in',
                sign_out: 'Sign Out',
                sign_up: 'Sign up',
                sign_up_using: 'Sign up using',
                step: 'Step',
                student: 'Student',
                submit_to_partner: 'Submit to {partner}',
                submit_your_answers: 'Submit your answers to Google Classroom or Microsoft Teams, or you can also share your finished work with the link below.',
                success: 'Success',
                successfully_copied: 'Successfully copied to clipboard',
                teacher: 'Teacher',
                type_the_problem: 'Type the problem here',
                unable_to_switch_to_v1: 'Unable to switch, please check if your local storage access is enabled',
                user_profile: 'User Profile',
                welcome_to_mobile: 'Welcome to mobile!',
                where_are_you_from: 'Where are you from?',
                who_are_you: 'Who are you?',
                year_of_birth: 'Year of Birth',
                you_dont_have_any_sets: 'You don\'t have any sets yet! Try solving one of the example problem sets.',
                your_work_cannot: 'Your work cannot be edited',
            },
            es: {},
        });
    }
}

export default (new Locales());
