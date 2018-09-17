import { NotificationManager } from 'react-notifications';

const ALERT_DELAY_MS = 4000;

function alertInfo(message, title) {
    NotificationManager.info(message, title, ALERT_DELAY_MS);
}

function alertSuccess(message, title) {
    NotificationManager.success(message, title, ALERT_DELAY_MS);
}

function alertWarning(message, title) {
    NotificationManager.warning(message, title, ALERT_DELAY_MS);
}

function alertError(message, title) {
    NotificationManager.error(message, title, ALERT_DELAY_MS);
}

export { alertInfo, alertSuccess, alertWarning, alertError }
