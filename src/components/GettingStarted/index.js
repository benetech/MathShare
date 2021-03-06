import React from 'react';
import { Helmet } from 'react-helmet';
import styles from './styles.scss';
import Locales from '../../strings';
import MainPageHeader from '../Home/components/Header';


const GettingStarted = () => (
    <div className={styles.container}>
        <Helmet>
            <title>
                {`${Locales.strings.getting_started_title} - ${Locales.strings.mathshare_benetech}`}
            </title>
        </Helmet>
        <MainPageHeader />
        <main id="mainContainer" className={styles.content}>
            <h1 className={styles.header} tabIndex={-1}>{Locales.strings.getting_started_title}</h1>
            <div className={styles.textContent}>
                <div className={styles.mainSection}>
                    <h2 id="creating-a-set">{Locales.strings.creating_a_problem_set}</h2>
                    <ol aria-labelledby="creating-a-set">
                        {Locales.strings.creating_a_problem_set_steps.map(step => (
                            <li>{step}</li>
                        ))}
                    </ol>
                    <div className={styles.subSection}>
                        <h3 id="adding-a-problem-set">{Locales.strings.adding_a_problem_set}</h3>
                        <ol aria-labelledby="adding-a-problem-set">
                            {Locales.strings.adding_a_problem_set_steps.map(step => (
                                <li>{step}</li>
                            ))}
                        </ol>
                        <p>{Locales.strings.adding_a_problem_set_note}</p>
                    </div>
                    <div className={styles.subSection}>
                        <h3 id="deleting-a-problem-set">{Locales.strings.deleting_and_editing}</h3>
                        <ol aria-labelledby="deleting-a-problem-set">
                            {Locales.strings.deleting_and_editing_steps.map(step => (
                                <li>{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
                <div className={styles.mainSection}>
                    <h2>{Locales.strings.sharing_sets}</h2>
                    <div className={styles.subSection}>
                        <h3 id="sharing-a-problem-set">{Locales.strings.sharing_sets_with_students}</h3>
                        <ol aria-labelledby="sharing-a-problem-set">
                            {Locales.strings.sharing_sets_with_students_steps.map(step => (
                                <li>{step}</li>
                            ))}
                        </ol>
                    </div>
                    <div className={styles.subSection}>
                        <h3 id="sharing-a-solution-set">{Locales.strings.sharing_solution_sets}</h3>
                        <p>{Locales.strings.sharing_solution_sets_note}</p>
                        <ol aria-labelledby="sharing-a-solution-set">
                            {Locales.strings.sharing_solution_sets_steps.map(step => (
                                <li>{step}</li>
                            ))}
                        </ol>
                    </div>
                    <div className={styles.subSection}>
                        <h3>{Locales.strings.sharing_sets_with_teachers}</h3>
                        <p>{Locales.strings.sharing_sets_with_teachers_note}</p>
                    </div>
                    <div className={styles.subSection}>
                        <h3 id="copying-a-problem-set">{Locales.strings.copying_problem_sets}</h3>
                        <p>{Locales.strings.copying_problem_sets_note}</p>
                        <ol aria-labelledby="copying-a-problem-set">
                            {Locales.strings.copying_problem_sets_steps.map(step => (
                                <li>{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
                <div className={styles.mainSection}>
                    <h2>{Locales.strings.solving_problems}</h2>
                    <div className={styles.subSection}>
                        <h3 id="adding-steps-to-problems">{Locales.strings.adding_steps_to_problems}</h3>
                        <ol aria-labelledby="adding-steps-to-problems">
                            {Locales.strings.adding_steps_to_problems_steps.map(step => (
                                <li>{step}</li>
                            ))}
                        </ol>
                    </div>
                    <div className={styles.subSection}>
                        <h3>{Locales.strings.editing_a_step}</h3>
                        <p>{Locales.strings.editing_a_step_note}</p>
                    </div>
                    <div className={styles.subSection}>
                        <h3>{Locales.strings.deleting_a_step}</h3>
                        <p>{Locales.strings.deleting_a_step_note}</p>
                    </div>
                    <div className={styles.subSection}>
                        <h3 id="sharing-solution">{Locales.strings.sharing_your_answered_set}</h3>
                        <ol aria-labelledby="sharing-solution">
                            {Locales.strings.sharing_your_answered_set_steps.map(step => (
                                <li>{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </main>
    </div>
);

export default GettingStarted;
