import { NotificationManager } from 'react-notifications';

const ALERT_DELAY_MS = 4000;

export default function createAlert(type, message, title) {
    switch (type) {
        case 'info':
            NotificationManager.info(message, title, ALERT_DELAY_MS);
            break;
        case 'success':
            NotificationManager.success(message, title, ALERT_DELAY_MS);
            break;
        case 'warning':
            NotificationManager.warning(message, title, ALERT_DELAY_MS);
            break;
        case 'error':
            NotificationManager.error(message, title, ALERT_DELAY_MS);
            break;
      }
}
