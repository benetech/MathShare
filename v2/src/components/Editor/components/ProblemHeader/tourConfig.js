import React from 'react';
import classNames from 'classnames';
import Button from '../../../Button';
import Locales from '../../../../strings';
import problem from './styles.scss';

const accentColor = 'rgb(0, 98, 217)';

const tourConfig = [
    {
        selector: '#mathEditorActive',
        content: Locales.strings.tour_editor,
    },
    {
        selector: '#mathAnnotationContainer',
        content: Locales.strings.tour_annotation,
    },
    {
        selector: '#inputContainersSelectors',
        content: Locales.strings.tour_input_containers,
    },
    {
        selector: '#addStep',
        content: Locales.strings.tour_add_step,
    },
    {
        selector: '#mathStep-1',
        content: function DemoHelperComponent() {
            return (
                <div>
                    {Locales.strings.tour_math_step_part_1}
                    <Button
                        id="tour_step1"
                        className={
                            classNames(
                                'btn',
                                problem.iconBtn,
                                problem.btnDelete,
                            )
                        }
                        disabled
                        additionalStyles={['background']}
                    />
                    {Locales.strings.tour_math_step_part_2}
                    <Button
                        id="tour_step2"
                        className={
                            classNames(
                                'btn',
                                problem.iconBtn,
                                problem.btnEdit,
                            )
                        }
                        disabled
                        additionalStyles={['background']}
                    />
                    .
                </div>
            );
        },
    },
    {
        selector: '#clearAllStepsBtn',
        content: Locales.strings.tour_clear_all,
    },
    {
        selector: '#saveBtn',
        content: Locales.strings.tour_save,
        position: 'bottom',
    },
    {
        selector: '#shareBtn',
        content: Locales.strings.tour_share,
        position: 'bottom',
    },
];

export { tourConfig, accentColor };
