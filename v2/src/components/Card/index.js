/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useState } from 'react';
import TruncateMarkup from 'react-truncate-markup';
import {
    // faCheckCircle,
    faCopy,
    faEllipsisH,
    faMinusCircle,
    faPlusCircle,
    faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button,
    Dropdown,
    Menu,
    Modal,
    Progress,
} from 'antd';
import styles from './styles.scss';
import Locales from '../../strings';
import { stopEvent } from '../../services/events';
import ProblemSetShareModal from '../Modals/ProblemSetShareModal';
import { FRONTEND_URL_PROTO } from '../../config';

const getColor = (id) => {
    const hash = Number(id || '0') % 3;
    if (hash === 1) {
        return styles.color2;
    } if (hash === 2) {
        return styles.color3;
    }
    return styles.color1;
};

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

const handleHideModal = (updateModalVisible, callback) => () => {
    if (callback) {
        callback();
    }
    updateModalVisible(false);
};


const renderTitle = (props) => {
    const {
        layoutMode,
        title,
    } = props;

    const commonTitle = (
        <div className={styles.problemSetTitle}>
            {title || 'Undefined'}
        </div>
    );

    if (layoutMode === 'line-item') {
        return commonTitle;
    }
    return (
        <TruncateMarkup lines={4} tokenize="characters">
            {commonTitle}
        </TruncateMarkup>
    );
};

const renderImage = (props) => {
    const {
        userProfile,
        isExampleSet,
    } = props;
    if (isExampleSet) {
        return (
            <img
                src="https://mathshare-qa.diagramcenter.org/images/favicon.png"
                alt={Locales.strings.profile_of_mathshare}
                className="img-fluid shadow-lg"
            />
        );
    }
    return (
        <img
            src={(userProfile && userProfile.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}`}
            alt={Locales.strings.profile_of_username.replace('{userName}', userProfile.name)}
            className="img-fluid shadow-lg"
        />
    );
};

const Card = (props) => {
    const {
        id,
        newSet,
        history,
        isExampleSet,
        problemCount,
        solutions,
        archiveProblemSet,
        duplicateProblemSet,
        userProfile,
        problemSet,
    } = props;
    const [isModalVisible, updateModalVisible] = useState(false);
    const [shareModal, updateShareModal] = useState(false);
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
    const totalCount = typeof (problemCount) === 'undefined' ? (solutions && solutions.length) : problemCount;
    const menu = (
        <Menu
            className={styles.menu}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            onClick={e => stopEvent(e.domEvent)}
        >
            {!solutions && (
                <Menu.Item onClick={e => stopEvent(e)}>
                    <Button type="text" icon={<FontAwesomeIcon icon={faCopy} />} onClick={duplicateProblemSet}>
                        Duplicate
                    </Button>
                </Menu.Item>
            )}
            {solutions && userProfile.email && (
                <Menu.Item>
                    <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faShare} />}
                        onClick={() => {
                            updateShareModal(true);
                        }}
                    >
                        {Locales.strings.share_my_work}
                    </Button>
                    <ProblemSetShareModal
                        problemList={problemSet}
                        shareLink={`${FRONTEND_URL_PROTO}/app/problemSet/review/${problemSet.problemSetShareCode}`}
                        isSolutionSet
                        centered
                        visible={shareModal}
                        onOk={() => {
                            updateShareModal(false);
                        }}
                        onCancel={() => {
                            updateShareModal(false);
                        }}
                    />
                </Menu.Item>
            )}
            {!isExampleSet && userProfile.email && (
                <Menu.Item onClick={e => stopEvent(e)}>
                    <Button type="text" icon={<FontAwesomeIcon icon={faMinusCircle} />} onClick={() => updateModalVisible(!isModalVisible)}>
                        Delete
                    </Button>
                    <Modal
                        title="Confirm"
                        visible={isModalVisible}
                        onOk={handleHideModal(updateModalVisible, archiveProblemSet)}
                        onCancel={handleHideModal(updateModalVisible)}
                        okText="Okay"
                        cancelText="Cancel"
                    >
                        <p>This will permanently delete the problem set.</p>
                    </Modal>
                </Menu.Item>
            )}
        </Menu>
    );

    return (
        <a id={id} key={id} href={getLink(props)} className={`${styles.tileContainer} ${getColor(id)}`}>
            <div className={styles.tile}>
                <div className={styles.header}>
                    {renderImage(props)}
                </div>
                {(!solutions || (!isExampleSet && userProfile.email)) && (
                    <div className={styles.iconContainer}>
                        {/* {completedProblems === totalCount && totalCount > 1 && (
                            <div className={styles.check} aria-label="Completed checkmark">
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </div>
                        )} */}
                        <Dropdown
                            overlay={menu}
                            placement="bottomRight"
                            className={styles.icon}
                            overlayClassName={styles.dropdown}
                            trigger={['click']}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                            <Button type="text" size="large" icon={<FontAwesomeIcon icon={faEllipsisH} />} onClick={e => e.preventDefault()} />
                        </Dropdown>
                    </div>
                )}
                <div className={styles.content}>
                    <div className={styles.mainContent}>
                        {/* <div className={styles.course}>Course</div> */}
                        {renderTitle(props)}
                    </div>
                </div>
                <div className={styles.progressContainer}>
                    <div className={styles.progressText}>
                        {(!solutions || totalCount === 0) ? '' : 'Progress'}
                        {totalCount === 0 ? (
                            <span>Empty</span>
                        ) : (
                            <span>
                                {!solutions ? '' : `${String(completedProblems || '0').padStart(2, '0')} of `}
                                {String(totalCount).padStart(2, '0') || '0'}
                                {' '}
                                Problems
                            </span>
                        )}
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
        </a>
    );
};

export default Card;
