/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import {
    faEllipsisH, faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Progress,
} from 'antd';
import styles from './styles.scss';

const Card = (props) => {
    const {
        id, title, newSet, history, isExampleSet, problemCount,
    } = props;
    if (newSet) {
        return (
            <div
                onClick={() => {
                    console.log('history', history);
                    history.push('/dash');
                }}
            >
                <div className={`${styles.tile} ${styles.newSet}`}>
                    <div>
                        <div>
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </div>
                        <div>
                        Add your first problem here
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div id={id} key={id} className={styles.tileContainer}>
            <div className={styles.tile}>
                <div className={styles.header}>
                    <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200" alt="" className="img-fluid shadow-lg" />
                    <span className={styles.icon}><FontAwesomeIcon icon={faEllipsisH} /></span>
                </div>
                <div className={styles.content}>
                    <div className={styles.mainContent}>
                        {/* <div className={styles.course}>Course</div> */}
                        <div className={styles.problemSetTitle}>{title || 'Solve for X'}</div>
                    </div>
                    <div className={styles.progressContainer}>
                        <div className={styles.progressText}>
                            {isExampleSet ? '' : 'Progress'}
                            <span>
                                {isExampleSet ? '' : '4 of '}
                                {problemCount || '6'}
                                {' '}
                                Problems
                            </span>
                        </div>
                        {!isExampleSet && (
                            <div>
                                <div className="progress">
                                    <Progress
                                        strokeColor={{
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                        }}
                                        percent={66}
                                        showInfo={false}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
