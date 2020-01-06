import * as dayjs from 'dayjs';

import LocalizedStrings from 'react-localization';

const now = dayjs();


class Locales {
    constructor() {
        this.strings = new LocalizedStrings({
            en: {
                accessibility: 'Accessibility',
                accessible_to_all: 'Accessible to ALL Learners',
                actions_for_this_problem_set: 'Actions for this Problem Set',
                add_problem: ' Add Problem',
                add_problem_button_title: 'Add a new problem (⌨: shift+enter)',
                add_problem_equation: '+',
                add_problem_set: 'New Problem Set',
                add_problem_title: 'Add new Problem',
                add_problems: ' Add problem(s) to Problem Set',
                add_problems_new_set: ' Add problem(s) to new Problem Set',
                add_step: ' Add step',
                add_step_button_title: 'Clean up the cross outs and start a new step (⌨: shift+enter)',
                add_step_intro: 'Clean-up your work and start a new step.',
                added_problem_at_index: 'Added new problem in position {index}',
                all_problem_sets: 'All Problem Sets',
                all_problems: ' All Problems',
                archive: 'Archive',
                archived_problem_set: 'Archived Problem Set',
                archived_problem_set_failure: 'Failed to archive Problem Set',
                assign: 'Assign:',
                assign_with_a_link: 'Assign with a link: ',
                back_to_problem_page: 'Go back to all problems',
                backslash: 'backslash ',
                bang: 'exclamation point',
                benetech: 'Benetech',
                benetech_empowers: 'Benetech Mathshare empowers students to solve math problems and show their work so that teachers and students can see how they got there.',
                benetech_initiative: 'Benetech Initiative',
                benetech_logo: 'Benetech Logo',
                beta: 'beta',
                cancel: ' Cancel',
                cancel_edit_button_title: 'Cancel edit',
                cancel_edit_step: ' Cancel edit',
                cancel_edit_step_intro: 'Cancel edit.',
                carrot: 'carrot',
                choose_one: 'Choose one',
                choose_palettes_title: 'Select button palettes available for this problem set',
                choose_palettes_to_add_equations: 'Please choose palettes that you will use to add equations',
                clean_up_and_add_step: 'Clean up and add new step',
                cleanup: '(cleanup)',
                clear_all: ' Clear all',
                clear_all_title: 'Clear all steps',
                clear_sketchpad: 'Clear the sketchpad',
                close: ' Close',
                comma: 'comma',
                confirmation_modal_sure_to_remove_problem: 'Are you sure you want to delete this problem?',
                confirmation_modal_unsaved_title: 'You have unsaved changes, do you wish to save?',
                connect: 'Connect',
                contact_us: ' Contact Us',
                continue_without_signing_in: 'Continue without signing in',
                continue_without_signing_up: 'Continue without signing up',
                copy: ' Copy',
                copy_this_link: 'Copy this link to the problem set and give to your students',
                copyright: 'Copyright 2019 Benetech. All rights reserved.',
                created_problem_set: 'Problem Set has been created',
                current_problems: 'Current Problems',
                dash: 'minus',
                dashboard: 'Dashboard',
                delete: 'Delete',
                delete_step: ' Delete Step',
                delete_this_step: 'Delete this Step',
                describe_your_role: 'Which best describes your role?',
                describe_your_work: 'Describe your work',
                diagram_center: 'DIAGRAM Center',
                dictate: 'Dictate',
                dictatation_complete: 'Dictation complete',
                dictatation_started: 'Dictation started',
                discard_changes: ' Discard Changes',
                done: ' Done',
                dot: 'dot',
                duplicate_set: 'Duplicate Set',
                edit: 'Edit',
                edit_equation: 'edit equation',
                edit_link_label: 'URL for editing: ',
                edit_problem: 'Edit Problem',
                edit_problem_set: 'Edit Problem Set',
                edit_this_step: 'Edit this Step',
                edit_title: 'Edit Problem Set Title',
                editor_actions: 'Editor Actions',
                email: 'Email',
                enter_your_email: 'Enter your email',
                equation: 'Equation',
                error: 'Error',
                example: 'example',
                example_edit_code: 'Here you could find an URL with edit code',
                example_problem: 'Example Problem',
                example_share_code: 'Here you could find an URL with share code',
                failure: 'Failure',
                ferpa_coppa: 'FERPA/COPPA',
                filter: 'Filter',
                finish: ' Finish',
                finish_edit: 'Finish Edit',
                finished: 'finished',
                font: 'Font',
                footer: 'Footer',
                footer_description: ` initiative supported by the U.S. Department of Education, Office of Special Education Programs (Cooperative Agreement #H327B100001). Opinions expressed herein are those of the authors and do not necessarily represent the position of the U.S. Department of Education. Poet™ is a trademark of Beneficent Technology, Inc. This website is copyright © 2012-${now.format('YYYY')}, Beneficent Technology, Inc.`,
                free_and_open_source: 'Free and Open Source',
                get_notified_about_mobile: ' Get notified about mobile',
                getting_started_equation: 'Click here to see an example problem and learn how to use the editor',
                getting_started_title: ' Getting Started',
                go_to_app: 'Go to App',
                go_to_main_content: 'Skip to Main Content',
                google: 'Google',
                google_classroom: 'Google Classroom',
                google_logo: 'Google Logo',
                grade_and_role_warning: 'Please make sure a grade and role is selected',
                grade_of_work: 'What grade do you work with?',
                hash: '#',
                header: ' Navigation ',
                help_center: ' Help Center',
                help_students: 'Help students show and organize their math work',
                history_data_intro: 'Review your work. The trash icon also allows you to delete and rework a prior step.',
                i_m_student: "I'm a Student",
                i_m_teacher: "I'm a Teacher",
                idea_logo_alt: 'IDEA Logo',
                if_you_want_a_link: "If you want a link to submit your finished work, use the 'Share' button instead.",
                if_you_want_to_continue: "If you want to continue working on it later, use the 'Save' button instead",
                info: 'Info',
                is_a: ' is a ',
                join_us_in_1: 'Join us in making math more accessible for all students by becoming a partner. Mathshare is free and open source. Integrate it into your program or become a development partner',
                join_us_in_2: 'complete this form',
                join_us_in_3: 'and we will be in touch soon.',
                keyboard: 'shortcut is ',
                keyboard_shortcuts: 'Keyboard shortcuts',
                letterSpacing: 'Letter Spacing',
                lineHeight: 'Line Height',
                link: ' Link',
                lms_integration: 'LMS Integration',
                loading: 'Loading...',
                login_something_wrong: 'Sorry, something went wrong. Your user profile could not be retrieved. You can try to sign in again or return to MathShare as a guest.',
                login_using: 'Login using',
                logo: 'logo',
                math: 'math',
                math_button_invalid_selection: 'Selection must contain only numbers and operators',
                math_button_select_exp: 'You must select an arithmetic expression for calculation',
                math_editor: 'Math editor',
                math_input_buttons: 'math input buttons',
                math_palette: 'Select Button Palettes',
                mathshare_benetech: 'Benetech Mathshare',
                mathshare_gif: 'animation showing math with synchronized highlighting',
                mathshare_is_a: 'Mathshare is a',
                mathshare_is_a_free: 'Mathshare is a free, open source tool developed by Benetech, a nonprofit that empowers communities with software for social good. Mathshare’s mission is to make math accessible for all students. Mathshare is free for schools to use and for learning management systems to integrate into their platforms.',
                mathshare_logo: 'Mathshare Logo, a Benetech Initiative',
                mathshare_open_source: 'Image showing open source logo',
                mathshare_privacy_1: 'Mathshare shares the Benetech privacy policy which is found at',
                mathshare_privacy_2: '. When signing in using an LMS or other sign in service we request and store the following information from the service. First and last name, email, and user ID. Mathshare uses this data to maintain or administer our Services, perform business analyses, or for other internal purposes to improve the quality of our business, the Services, and other products and services we offer. We may use information provided by you in other manners, as otherwise described to you at the point of collection or pursuant to your consent. Data is stored securely in the United States.',
                mathshare_privacy_updated: 'Updated 7-2-19',
                mathshare_supported_lms: 'several logos of several LMS vendors, including Canvas, Google Classroom, Schoology, Moodle, OneNote, and Blackboard',
                mission: 'Our mission is to make math accessibility free and open to all students.',
                mobile_not_supported: 'Mobile is not currently supported',
                more_options: 'More Options',
                more_options_for: 'More Options for {title}',
                ms: 'Microsoft',
                ms_logo: 'Microsoft Logo',
                ms_team: 'Microsoft Teams',
                my_steps: 'My Steps',
                my_work: 'My Work',
                new_problem: ' New Problem',
                new_problem_set: 'New Problem Set',
                next: 'Next',
                no_description_warning: 'Please provide a description of your work.',
                no_palettes_chosen_warning: 'Please select at least one palette',
                no_problem_equation_or_image_and_title_warning: 'Please provide problem title and problem equation or an image',
                no_problem_equation_or_image_warning: 'Please provide a problem equation or an image.',
                no_problem_title_warning: 'Please provide a problem title.',
                no_step_number: 'No step number ',
                not_saved_yet: 'Not saved yet.',
                number: 'Number',
                open_image: 'Open image',
                open_mathshare: 'Open MathShare',
                open_source: 'Open Source',
                opens_in_new_tab: '(opens new tab)',
                opens_in_new_window: '(opens in new window)',
                overview: 'Overview',
                page_was_not_found: 'We are sorry but the page you are looking for does not exist.',
                page_was_not_found_info: 'Please visit the homepage or contact us about the problem.',
                page_was_not_found_title: 'Page Not Found',
                partners: 'Partners',
                partnerships: 'Partnerships',
                personalization: 'Personalization',
                personalization_config_has_been_updated: 'Personalization config has been updated',
                personalization_settings: 'Personalization Settings',
                please_enter_valid_email: 'Please enter a valid email',
                please_fill_your_details: 'Please fill your details',
                policies: 'Policies',
                pre_made_sets: 'Pre-made Sets',
                privacy_policy: 'Privacy Policy',
                problem_image: 'Problem image',
                problem_row_controls: 'Problem row controls',
                problem_saved_success_message: 'Problem saved.',
                problem_set_1: 'Problem Set 01',
                problem_set_2: 'Problem Set 02',
                problem_set_3: 'Problem Set 03',
                problem_sets: 'Problem Sets',
                problems: 'Problems',
                problems_in_this_set: 'Problems in this Set',
                problems_to_solve: ' Problems to solve ',
                provide_feedback: ' Give Feedback',
                reason: 'reason',
                redirecting: 'Redirecting',
                redirecting_to_fill: 'Redirecting to fill your information',
                recent: 'Recent',
                remove_problem: 'Remove Problem',
                reset_problem_set: 'Reset Problem Set',
                resources: 'Resources',
                return_to_mathshare: 'Return to MathShare as a guest',
                save: ' Save',
                save_changes: ' Save Changes',
                save_intro: 'Save your work or close out to try again from the beginning.',
                save_text: 'Save Text: ',
                scratchpad: ' Sketch',
                scratchpad_alt: 'Problem sketch',
                scratchpad_enlarge: 'Enlarge sketch',
                screenshot_math_interface: 'Screen shot showing math share interface',
                screenshot_step_by_step: 'Screenshot showing example problem being solved step by step',
                select_a_problem: 'Select a problem to try out the MathShare Editor',
                select_a_problem_header: "Benetech's MathShare Editor (alpha)",
                select_symbol_or_scratchpad: 'Select symbol or scratchpard tab',
                setup_your_account: "Let's setup your account",
                share: ' Share',
                share_link: 'Share Link: ',
                share_on: 'Share on',
                share_on_twitter: 'Share on Twitter',
                share_permalink: 'Share Permalink',
                share_problem_set: 'Share Problem Set',
                share_with_teachers: ' Share with Teachers',
                share_with_teachers_text: 'Check out my #accessible math problems made in @mathshare. Supports learning styles, special needs and #4Cs. ',
                show_their_work: 'Show their work',
                sign_in: 'Sign In',
                sign_out: 'Sign Out',
                sign_up: 'Sign Up',
                sign_up_using: 'Sign Up using',
                sketchpad_loading_warning: "Sketchpad library wasn't loaded properly",
                speech_recongition_error: 'Speech recognition is not supported on your device',
                speech_recongition_permission_denied: "We couldn't access your audio stream",
                start_speaking: 'Start Speaking',
                step: 'Step',
                step_after_cleanup: 'step, after cleanup',
                steps: 'Steps',
                stop_dictation: 'Stop Dictation',
                students_can_solve: 'Students can solve equations step-by-step and add notes to explain their thinking.',
                students_visit: 'Students visit the link below to access the problem set',
                students_with_and_without: 'Students with and without learning differences can use Mathshare with features like text-to-speech, speech-to-text, and word-level highlighting',
                submit: 'Submit',
                submit_a_partnership: 'Submit a partnership request through our contact form',
                submit_problem_link: 'Submit Problem Link: ',
                success: 'Success',
                successfull_update_message: 'The step has been updated.',
                sure: 'Sure?',
                system_default: 'System Default',
                switch_to_sketchpad: 'Switch to the sketchpad view',
                switch_to_symbols: 'Switch to the symbols view',
                symbols: ' Symbols',
                tos: 'Terms of Service',
                thanks_for_details: 'Thanks for sharing your details',
                thanks_for_mobile_notfiy: 'Thanks, we will notify you once we add mobile compatibility',
                the: 'The',
                title: 'Title',
                to_mathshare_twitter: 'Twitter',
                to_mathshare_youtube: 'YouTube',
                tour_add_step: 'Clean-up your work and start a new step.',
                tour_annotation: 'Describe your work by typing directly or using the microphone to record an explanation of your work (required).',
                tour_clear_all: 'You can clear all steps here.',
                tour_edit: 'Use this link to continue your work in the future.',
                tour_editor: 'Type or edit the equation using your keyboard and the math keys below. Try using the cross out, replace, and calc buttons to help show your work.',
                tour_input_containers: 'You can switch between symbols palette and the sketchpad.',
                tour_math_step_part_1: 'Review your work. The trash icon',
                tour_math_step_part_2: 'allows you to delete and rework a prior step. You can also edit the step, using',
                tour_save: "Save your work so you don't lose it.",
                tour_share: 'Share your solution with others.',
                try_now: 'Try now',
                tts_hint: 'Use the microphone button or type to explain your work (required)',
                tts_hint_add_problem: 'Use the microphone button or type to add problem title (required)',
                tts_intro: 'Describe your work by typing directly \nor using the microphone to record an explanation of your work (required).',
                tts_intro_add_problem: 'Describe problem titlw by typing directly \nor using the microphone to record a title of problem (required).',
                tutorial: ' Tutorial',
                twitter: 'Twitter',
                type_math_here: 'type math here',
                underbar: 'line',
                undo_last_action: 'Undo Last Action (⌨: shift+backspace)',
                undo_step: ' Undo',
                untitled_problem_set: 'Untitled Problem Set',
                update_problem: ' Update Problem',
                update_problem_button_title: 'Update the problem (⌨: shift+enter)',
                update_problem_intro: 'Update the problem.',
                update_step: ' Update Step',
                update_step_button_title: 'Update the step (⌨: shift+enter)',
                update_step_intro: 'Update the step.',
                update_title: 'Problem Set Title',
                upload: 'Upload',
                upload_no_file_warning: 'Please select a file',
                use_on_your_lms: 'Use on your schools LMS (learning management system) through assignment links, with native integrations and single sign on (SSO) coming soon.',
                use_this_link: 'Use this link to save your work and return to it later',
                use_this_link_share: 'Use this link to share your',
                user_profile: 'User Profile',
                view_as_student: ' View as Student',
                view_problem_description: 'view problem description',
                view_sketch: 'View Sketch',
                warning: 'Warning',
                who_are_you: 'Who are you?',
                work: 'work',
                work_area_heading: 'math and description of your work',
                work_area_intro: 'Type or edit the equation using your keyboard and the math keys below. \nTry using the cross out, replace, and calc buttons to help show your work.',
                workshop_materials: 'Workshop Materials',
                yes: ' Yes',
                you_are_now_on: 'You are now on the "{pageTitle}" page',
                you_are_signed_in: 'You are now signed in as {user}',
                you_have_been_logged_out: 'You have been logged out',
                youtube: 'YouTube',
            },
            es: {},
        });
    }
}

export default (new Locales());
