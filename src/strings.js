import LocalizedStrings from 'react-localization';


class Locales {
    constructor() {
        this.strings = new LocalizedStrings({
            en: {
                my_steps: 'My Steps',
                steps: 'Steps',
                step: 'Step',
                step_after_cleanup: 'step, after cleanup',
                cleanup: '(cleanup)',
                edit_this_step: 'Edit this Step',
                delete_this_step: 'Delete this Step',
                edit: 'Edit',
                delete: 'Delete',
                math: 'math',
                reason: 'reason',
                keyboard: 'shortcut is ',
                dash: 'minus',
                comma: 'comma',
                bang: 'exclamation point',
                backslash: 'backslash ',
                dot: 'dot',
                carrot: 'carrot',
                underbar: 'line',
                history_data_intro: 'Review your work. The trash icon also allows you to delete and rework a prior step.',
                math_input_buttons: 'math input buttons',
                speech_recongition_error: 'Speech recognition is not supported on your device',
                speech_recongition_permission_denied: 'We couldn\'t access your audio stream',
                start_speaking: 'Start Speaking',
                work_area_intro: 'Type or edit the equation using your keyboard and the math keys below. \nTry using the cross out, replace, and calc buttons to help show your work.',
                work_area_heading: 'math and description of your work',
                math_editor: 'Math editor',
                edit_equation: 'edit equation',
                type_math_here: 'type math here',
                tts_hint: 'Use the microphone button or type to explain your work (required)',
                tts_intro: 'Describe your work by typing directly \nor using the microphone to record an explanation of your work (required).',
                tts_hint_add_problem: 'Use the microphone button or type to add problem title (required)',
                tts_intro_add_problem: 'Describe problem titlw by typing directly \nor using the microphone to record a title of problem (required).',
                done: ' Done',
                clear_all: ' Clear all',
                clear_all_title: 'Clear all steps',
                save_intro: 'Save your work or close out to try again from the beginning.',
                clear_sketchpad: 'Clear the sketchpad',
                sketchpad_loading_warning: 'Sketchpad library wasn\'t loaded properly',
                undo_last_action: 'Undo Last Action (⌨: shift+backspace)',
                clean_up_and_add_step: 'Clean up and add new step',
                add_step_button_title: 'Clean up the cross outs and start a new step (⌨: shift+enter)',
                update_problem_button_title: 'Update the problem (⌨: shift+enter)',
                add_problem_button_title: 'Add a new problem (⌨: shift+enter)',
                add_step: ' Add step',
                add_step_intro: 'Clean-up your work and start a new step.',
                update_step_button_title: 'Update the step (⌨: shift+enter)',
                update_step: ' Update Step',
                update_step_intro: 'Update the step.',
                update_problem: ' Update Problem',
                update_problem_intro: 'Update the problem.',
                cancel_edit_button_title: 'Cancel edit',
                cancel_edit_step: ' Cancel edit',
                cancel_edit_step_intro: 'Cancel edit.',
                my_work: 'My Work',
                no_description_warning: 'Please provide a description of your work.',
                no_problem_title_warning: 'Please provide a problem title.',
                no_problem_equation_or_image_warning: 'Please provide a problem equation or an image.',
                no_problem_equation_or_image_and_title_warning: 'Please provide problem title and problem equation or an image',
                warning: 'Warning',
                successfull_update_message: 'The step has been updated.',
                problems_to_solve: ' Problems to solve ',
                select_a_problem_header: 'Benetech\'s MathShare Editor (alpha)',
                select_a_problem: 'Select a problem to try out the MathShare Editor',
                go_to_main_content: 'Skip to Main Content',
                getting_started_title: 'Getting Started',
                getting_started_equation: 'Click here to see an example problem and learn how to use the editor',
                problem_saved_success_message: 'Problem saved.',
                reset_problem_set: 'Reset Problem Set',
                success: 'Success',
                share_problem_set: 'Share Problem Set',
                header: ' Navigation ',
                problems: 'Problems',
                created_problem_set: 'Problem Set has been created',
                problem_sets: 'Problem Sets',
                problem_set_1: 'Problem Set 01',
                problem_set_2: 'Problem Set 02',
                problem_set_3: 'Problem Set 03',
                upload: 'Upload',
                contact_us: 'Contact Us',
                help_center: 'Help Center',
                provide_feedback: ' Give Feedback',
                upload_no_file_warning: 'Please select a file',
                footer: 'Footer',
                idea_logo_alt: 'IDEA Logo',
                diagram_center: 'DIAGRAM Center',
                is_a: ' is a ',
                benetech: 'Benetech',
                footer_description: ' initiative supported by the U.S. Department of Education, Office of Special Education Programs (Cooperative Agreement #H327B100001). Opinions expressed herein are those of the authors and do not necessarily represent the position of the U.S. Department of Education. Poet™ is a trademark of Beneficent Technology, Inc. This website is copyright © 2012-2017, Beneficent Technology, Inc.',
                loading: 'Loading...',
                view_problem_description: 'view problem description',
                back_to_problem_page: 'back to list of problems',
                share: ' Share',
                copy: ' Copy',
                close: ' Close',
                add_problem_title: 'Add new Problem',
                add_problem: ' Add Problem',
                add_problem_equation: '+',
                save: ' Save',
                edit_link_label: 'URL for editing: ',
                cancel: ' Cancel',
                new_problem: ' New Problem',
                add_problems: ' Add problem(s) to Problem Set',
                add_problems_new_set: ' Add problem(s) to new Problem Set',
                hash: '#',
                equation: 'Equation',
                title: 'Title',
                save_text: 'Save Text: ',
                share_link: 'Share Link: ',
                assign_with_a_link: 'Assign with a link: ',
                submit_problem_link: 'Submit Problem Link: ',
                problem_image: 'Problem image',
                confirmation_modal_unsaved_title: 'You have unsaved changes, do you wish to save?',
                discard_changes: ' Discard Changes',
                choose_palettes_to_add_equations: 'Please choose palettes that you will use to add equations',
                next: 'Next',
                confirmation_modal_sure_to_remove_problem: 'Are you sure you want to delete this problem?',
                yes: ' Yes',
                save_changes: ' Save Changes',
                scratchpad: ' Sketch',
                scratchpad_alt: 'Problem sketch',
                scratchpad_enlarge: 'Enlarge sketch',
                symbols: ' Symbols',
                switch_to_sketchpad: 'Switch to the sketchpad view',
                switch_to_symbols: 'Switch to the symbols view',
                delete_step: ' Delete Step',
                undo_step: ' Undo',
                add_problem_set: 'New Problem Set',
                duplicate_set: 'Duplicate Set',
                edit_problem_set: 'Edit Problem Set',
                choose_palettes_title: 'Select button palettes available for this problem set',
                no_palettes_chosen_warning: 'Please select at least one palette',
                finish_edit: 'Finish Edit',
                edit_problem: 'Edit Problem',
                page_was_not_found_title: 'Page Not Found',
                page_was_not_found: 'We are sorry but the page you are looking for does not exist.',
                page_was_not_found_info: 'Please visit the homepage or contact us about the problem.',
                open_image: 'Open image',
                example: 'example',
                example_edit_code: 'Here you could find an URL with edit code',
                example_share_code: 'Here you could find an URL with share code',
                not_saved_yet: 'Not saved yet.',
                the: 'The',
                finish: ' Finish',
                tour_editor: 'Type or edit the equation using your keyboard and the math keys below. '
                    + 'Try using the cross out, replace, and calc buttons to help show your work.',
                tour_annotation: 'Describe your work by typing directly or using the microphone to record an explanation of your work (required).',
                tour_input_containers: 'You can switch between symbols palette and the sketchpad.',
                tour_add_step: 'Clean-up your work and start a new step.',
                tour_math_step_part_1: 'Review your work. The trash icon',
                tour_math_step_part_2: 'allows you to delete and rework a prior step. You can also edit the step, using',
                tour_clear_all: 'You can clear all steps here.',
                tour_save: 'Save your work so you don\'t lose it.',
                tour_edit: 'Use this link to continue your work in the future.',
                tour_share: 'Share your solution with others.',
                link: ' Link',
                submit: 'Submit',
                update_title: 'Problem Set Title',
                view_as_student: ' View as Student',
                share_with_teachers: ' Share with Teachers',
                share_with_teachers_text: 'Check out my #accessible math problems made in @mathshare_app. Supports learning styles, special needs and #4Cs. ',
            },
            es: {},
        });
    }
}

export default (new Locales());
