import {notification} from "antd";

const successNotification = (description) => notification['success']({message: 'Success', description});
const errorNotification = (description) => notification['error']({message: 'Error', description});

export {successNotification, errorNotification};
