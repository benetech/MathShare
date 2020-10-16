import { notification } from 'antd';

export const displayAlert = (type, description, message) => {
    notification[type]({
        message,
        description,
    });
};

export default {
    displayAlert,
};
