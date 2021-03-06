/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import mathLive from 'mathlive';
import { MathfieldComponent } from 'react-mathlive';
import TruncateMarkup from 'react-truncate-markup';

import {
    faCheckCircle,
    // faCopy,
    // faEllipsisH,
    // faMinusCircle,
    faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//     Button,
//     Dropdown,
//     Menu,
//     Popconfirm,
// } from 'antd';
import styles from './styles.scss';


class ProblemCard extends React.Component {
    componentDidMount() {
        mathLive.renderMathInDocument();
    }

    getColor = (id) => {
        const hash = Number(id || '0') % 3;
        if (hash === 1) {
            return styles.color2;
        } if (hash === 2) {
            return styles.color3;
        }
        return styles.color1;
    };

    getUrl = () => {
        const {
            editCode,
            shareCode,
        } = this.props;
        if (editCode) {
            return `/#/app/problem/edit/${editCode}`;
        }
        if (shareCode) {
            return `/#/app/problem/view/${shareCode}`;
        }
        return null;
    }

    renderTitle() {
        const {
            layoutMode,
            title,
        } = this.props;

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
    }

    render() {
        const {
            id,
            newSet,
            history,
            text,
            finished,
            action,
            problemPosition,
        } = this.props;
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
        // const menu = (
        //     <Menu
        //         className={styles.menu}
        //     >
        //         <Menu.Item>
        //             <Popconfirm
        //                 title="This will permanently delete the problem set."
        //                 okText="Okay"
        //                 cancelText="Cancel"
        //             >
        //                 <Button type="text" icon={<FontAwesomeIcon icon={faMinusCircle} />}>
        //                     Delete
        //                 </Button>
        //             </Popconfirm>
        //         </Menu.Item>
        //     </Menu>
        // );

        const editUrl = this.getUrl();
        const additionalProps = {};
        let ContainerTag = 'div';
        if (editUrl) {
            ContainerTag = 'a';
            additionalProps.href = editUrl;
        }

        return (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            <ContainerTag id={id} key={id} className={`${styles.tileContainer} ${this.getColor(id)}`} {...additionalProps}>
                <div className={styles.tile}>
                    <div className={styles.header}>
                        <div className={styles.number}>
                            {String(problemPosition).padStart(2, '0')}
                        </div>
                        {finished && action !== 'review' && (
                            <div className={styles.check}>
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    title="Completed checkmark"
                                    role="img"
                                />
                            </div>
                        )}
                        {/* <div className={styles.iconContainer}>
                            <Dropdown
                                overlay={menu}
                                placement="bottomRight"
                                className={styles.icon}
                                overlayClassName={styles.dropdown}
                            >
                                <Button
                                    type="text"
                                    size="large"
                                    icon={<FontAwesomeIcon icon={faEllipsisH} />}
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                />
                            </Dropdown>
                        </div> */}
                    </div>
                    <div className={styles.content}>
                        <div className={styles.mainContent}>
                            {this.renderTitle()}
                        </div>
                        <div className={styles.mathContent}>
                            <MathfieldComponent
                                tabIndex={0}
                                latex={text || ''}
                                mathfieldConfig={{
                                    readOnly: true,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </ContainerTag>
        );
    }
}

export default ProblemCard;
