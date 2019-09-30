import React from 'react';
import { toast } from 'react-toastify';

const ALERT_DELAY_MS = 4000;

const commonProps = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: ALERT_DELAY_MS,
    closeButton: false,
};

function getCommonAlert(title, message) {
    return (
        <div className="toast-common" role="alert">
            <h2 tabIndex={-1}>{title}</h2>
            <div>{message}</div>
        </div>
    );
}

function alertInfo(message, title) {
    toast.info(getCommonAlert(title, message), commonProps);
}

function alertSuccess(message, title) {
    toast.success(getCommonAlert(title, message), commonProps);
}

function alertError(message, title) {
    toast.error(getCommonAlert(title, message), commonProps);
}

function alertWarning(message, title) {
    toast.warn(getCommonAlert(title, message), commonProps);
}

export {
    alertInfo, alertSuccess, alertWarning, alertError,
};
