/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import {
    faCopy,
    faEllipsisH,
    faMinusCircle,
    faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button,
    Dropdown,
    Menu,
    Popconfirm,
    Progress,
} from 'antd';
import styles from './styles.scss';
import { stopEvent } from '../../services/events';

const getLink = (props) => {
    const {
        isExampleSet,
        editCode,
        shareCode,
        solutions,
    } = props;
    if (isExampleSet) {
        return `/#/app/problemSet/view/${shareCode}`;
    }
    if (solutions) {
        return `/#/app/problemSet/solve/${editCode}`;
    }
    return `/#/app/problemSet/edit/${editCode}`;
};

const Card = (props) => {
    const {
        id,
        title,
        newSet,
        history,
        isExampleSet,
        problemCount,
        solutions,
        archiveProblemSet,
        duplicateProblemSet,
        userProfile,
    } = props;
    if (newSet) {
        return (
            <div
                onClick={() => {
                    history.push('/app');
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
    let completedProblems = 0;
    if (solutions) {
        completedProblems = solutions.filter(solution => solution.finished).length;
    }
    const totalCount = problemCount || solutions.length;
    const menu = (
        <Menu
            className={styles.menu}
            onClick={e => stopEvent(e.domEvent)}
        >
            {!solutions && (
                <Menu.Item onClick={e => stopEvent(e)}>
                    <Button type="text" icon={<FontAwesomeIcon icon={faCopy} />} onClick={duplicateProblemSet}>
                        Duplicate
                    </Button>
                </Menu.Item>
            )}
            {!isExampleSet && userProfile.email && (
                <Menu.Item onClick={e => stopEvent(e)}>
                    <Popconfirm
                        title="This will permanently delete the problem set."
                        okText="Okay"
                        onConfirm={archiveProblemSet}
                        cancelText="Cancel"
                    >
                        <Button type="text" icon={<FontAwesomeIcon icon={faMinusCircle} />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Menu.Item>
            )}
        </Menu>
    );

    return (
        <a id={id} key={id} href={getLink(props)} className={styles.tileContainer}>
            <div className={styles.tile}>
                <div className={styles.header}>
                    <img
                        src="https://mathshare-qa.diagramcenter.org/images/favicon.png"
                        alt="Mathshare"
                        className="img-fluid shadow-lg"
                    />
                    {(!solutions || (!isExampleSet && userProfile.email)) && (
                        <div className={styles.iconContainer}>
                            <Dropdown
                                overlay={menu}
                                placement="bottomRight"
                                className={styles.icon}
                                overlayClassName={styles.dropdown}
                            >
                                <Button type="text" size="large" icon={<FontAwesomeIcon icon={faEllipsisH} />} onClick={e => e.preventDefault()} />
                            </Dropdown>
                        </div>
                    )}
                </div>
                <div className={styles.content}>
                    <div className={styles.mainContent}>
                        {/* <div className={styles.course}>Course</div> */}
                        <div className={styles.problemSetTitle}>{title || 'Undefined'}</div>
                    </div>
                    <div className={styles.progressContainer}>
                        <div className={styles.progressText}>
                            {(!solutions) ? '' : 'Progress'}
                            <span>
                                {!solutions ? '' : `${completedProblems} of `}
                                {totalCount}
                                {' '}
                                Problems
                            </span>
                        </div>
                        {solutions && (
                            <div>
                                <div className="progress">
                                    <Progress
                                        strokeColor={{
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                        }}
                                        percent={
                                            Math.round(100 * completedProblems / totalCount, 2)
                                        }
                                        format={percent => `Progress bar, ${percent}% full.`}
                                        showInfo
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </a>
    );
};

export default Card;
