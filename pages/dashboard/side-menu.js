import {Menu} from 'antd';
import routes from '../../routes';

const {Router} = routes;

const SideMenuSettings = (props) => {

  const handleMenuClick = (e) => {
    Router.pushRoute(e.key);
  };

  return (
    <div className='side-menu-container'>
      <Menu
        mode="inline"
        selectedKeys={[props.activeMenu]}
        onClick={handleMenuClick}>
        <Menu.Item key="business/general-info">
          General Information
        </Menu.Item>
        <Menu.Item key="business/gallery">
          Gallery
        </Menu.Item>
        <Menu.Item key="business/services-and-pricing">
          Services and Pricing
        </Menu.Item>
        <Menu.Item key="business/location">
          Location
        </Menu.Item>
        <Menu.Item key="business/social-media">
          Social Media
        </Menu.Item>
      </Menu>
    </div>
  );
};

export {SideMenuSettings};
