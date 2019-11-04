import {Menu, Icon} from 'antd';

const {SubMenu} = Menu;

const items = [
  {key: '/user', label: 'Users', icon: 'user', className: 'nav-text'},
  {key: '/company', label: 'Companies', icon: 'bank', className: 'nav-text'},
  {key: '/series', label: 'Series', icon: 'car', className: 'nav-text'},
  {key: '/case-number', label: 'Case Numbers', icon: 'number', className: 'nav-text'},
  {key: '/body-number', label: 'Body Numbers', icon: 'number', className: 'nav-text'},
  {key: '/garage', label: 'Garages', icon: 'car', className: 'nav-text'},
  {key: '/year-model', label: 'Year Models', icon: 'calendar', className: 'nav-text'},
  {key: '/drop-units', label: 'Drop Units', icon: 'car', className: 'nav-text'},
];

const ControlSubMenuList = (props) => {
  return (
    <SubMenu {...props}
             key="control"
             title={<span><Icon type="lock"/><span>Control</span></span>}>
      {items.map(menu => {
          return (
            <Menu.Item key={menu.key}>
              <Icon type={menu.icon}/>
              <span className={menu.className}>{menu.label}</span>
            </Menu.Item>
          );
        }
      )}
    </SubMenu>
  )
};

export default ControlSubMenuList;
