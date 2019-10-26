import {getCookie} from "../../lib/session";

const TopBar = () => {

  const userCookie = getCookie('userData');

  const user = (userCookie) ? JSON.parse(userCookie) : {};

  return (
    <span style={{fontWeight: 'bold', marginLeft: '20px', display: 'inline-block'}}>
      Hello, {user.first_name}
    </span>
  )
};

export default TopBar;
