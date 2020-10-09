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

const Card = (props) => {
    const {
        id, title, newSet, history, isExampleSet, problemCount,
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
    const menu = (
        <Menu className={styles.menu}>
            <Menu.Item>
                <Button type="text" icon={<FontAwesomeIcon icon={faCopy} />}>
                    Duplicate
                </Button>
            </Menu.Item>
            {!isExampleSet && (
                <Menu.Item>
                    <Popconfirm title="This will permanently delete the problem set." okText="Okay" cancelText="Cancel">
                        <Button type="text" icon={<FontAwesomeIcon icon={faMinusCircle} />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Menu.Item>
            )}
        </Menu>
    );

    return (
        <div id={id} key={id} className={styles.tileContainer}>
            <div className={styles.tile}>
                <div className={styles.header}>
                    <img
                        src="https://mathshare-qa.diagramcenter.org/images/favicon.png"
                        alt="Mathshare"
                        className="img-fluid shadow-lg"
                    />
                    <div className={styles.iconContainer}>
                        <Dropdown overlay={menu} placement="bottomRight" className={styles.icon} overlayClassName={styles.dropdown}>
                            <Button type="text" size="large" icon={<FontAwesomeIcon icon={faEllipsisH} />} />
                        </Dropdown>
                    </div>
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
                                        format={percent => `Progress bar, ${percent}% full.`}
                                        showInfo
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
