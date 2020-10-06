import React from 'react';
import {
    Button,
} from 'antd';
import styles from './styles.scss';

const CopyLink = () => (
    <div className={styles.copyLinkContainer}>
        <span className={styles.text}>
            Don&apos;t forget to copy the link to share your work
        </span>
        <Button type="primary" size="small">
            Copy WorkLink
        </Button>
    </div>
);

export default CopyLink;
