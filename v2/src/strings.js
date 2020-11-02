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
                back_to_all_sets: 'Back to All Sets',
                benefits_of_logging_in: 'Benefits of logging in',
                benefits_of_signing_up: 'Benefits of signing up',
                cancel: 'Cancel',
                continue_without_signing_in: 'Continue to Mathshare without logging in',
                continue_without_signing_up: 'Continue to Mathshare without signing up',
                delete: 'Delete',
                delete_confirmation: 'This will permanently delete the problem set.',
                duplicate: 'Duplicate',
                failure: 'Failure',
                google: 'Google',
                login_using: 'Log in using',
                mathshare_benetech: 'Benetech Mathshare',
                ms: 'Microsoft',
                okay: 'Okay',
                problem_saved_success_message: 'Problem Updated',
                restore: 'Restore',
                restore_success: 'Restored Problem Set - {title}',
                sign_in: 'Log in',
                sign_out: 'Sign Out',
                sign_up: 'Sign up',
                sign_up_using: 'Sign up using',
                success: 'Success',
            },
            es: {},
        });
    }
}

export default (new Locales());
