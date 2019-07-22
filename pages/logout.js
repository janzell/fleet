import {signOut} from '../lib/authenticate';

const Logout = (props) => {
  signOut();

  return null;
};

export default Logout;
