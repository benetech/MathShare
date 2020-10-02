import React from 'react';
import {
    Button,
} from 'antd';
import styles from './styles.scss';

const NotLoggedIn = () => (
    <div className={`row ${styles.loginPromptContainer}`}>
        <div className={styles.left}>
            <div><span role="img" aria-label="point up">&#9757;</span></div>
            <div>
                <div className={styles.notLoggedIn}>You are not logged in.</div>
                <div className={styles.prompt}>Save this link to return to your set later</div>
            </div>
        </div>
        <div className={styles.right}>
            <Button type="link">Login</Button>
            <Button type="primary">Sign up</Button>
        </div>
    </div>
);

export default NotLoggedIn;
