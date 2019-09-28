import {notification} from "antd";

function useNotificationWithIcon(type, message, description) {
  notification[type]({
    message,
    description
  });
}
export default useNotificationWithIcon;
