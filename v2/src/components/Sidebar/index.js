import React from 'react';
import styles from './styles.scss';

export default ({ router }) => {
    console.log('router', router);
    return (
        <div className="ct-sidebar col-12 col-md-4 col-xl-3">
            <div className={styles.header}>
                Math
                <span>(share)</span>
            </div>
            <div className="ct-sidebar-sroll-container">
                <div className={`${styles.profile} text-center`}>
                    <div className={`row justify-content-center ${styles.avatar}`}>
                        <div className="col-7">
                            <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200" alt="" className="img-fluid shadow-lg" />
                        </div>
                    </div>
                    <div className={styles.name}>
                        Adam Boone
                    </div>
                    <div className={styles.title}>
                        Teacher 9th grade
                    </div>
                    <div className={styles.signout}>Signout</div>
                </div>
                <div className={styles.actionButtons}>
                    <div>
                        <button type="button" className="btn btn-outline-default btn-icon btn-round">
                            <i className="fa fa-volume-up fa-2x" />
                        </button>
                        <button type="button" className="btn btn-outline-default btn-icon btn-round">
                            <i className="fa fa-microphone fa-2x" />
                        </button>
                    </div>
                    <div className="flex-end">
                        <button type="button" className="btn btn-outline-default btn-icon btn-round">
                            <span>A</span>
                            <i className="fa fa-minus" />
                        </button>
                        <button type="button" className="btn btn-outline-default btn-icon btn-round">
                            <span>A</span>
                            <i className="fa fa-plus" />
                        </button>
                    </div>
                </div>
                <div className={styles.contrastButtons}>
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-outline-default active">
                            Standard
                        </button>
                        <button type="button" className="btn btn-outline-default">
                            High Contrast
                        </button>
                        <button type="button" className="btn btn-outline-default">
                            Low Contrast
                        </button>
                    </div>
                </div>
                <nav className={styles.nav}>
                    <ul>
                        <li className={styles.active}>
                            Home
                        </li>
                        <li>
                            My Sets
                        </li>
                        <li>
                            Example Sets
                        </li>
                        <li>
                            About Math Share
                        </li>
                        <li>
                            Help
                        </li>
                        <li>
                            Settings
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};
