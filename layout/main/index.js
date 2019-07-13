import {Row, Col, Icon, Layout, Menu, Typography} from 'antd';
import {useState} from 'react';
import {Router} from '../../routes';

const {Text} = Typography;
const {Header, Sider, Footer, Content} = Layout;
const SubMenu = Menu.SubMenu;

import './index.css';

const menuStyles = {backgroundColor: '#373744'};
const headerStyles = {
  background: '#fff',
  padding: 0,
  position: 'fixed',
  zIndex: 1,
  width: '100%',
};

// const LOGO_STATE = {
//   width: 150,
//   display: 'block',
// };
// const INITIAL_LOGO_STATE = {
//   textAlign: 'center',
//   color: '#ce4257',
//   fontSize: '20px',
//   fontWeight: 'lighter',
//   display: 'none',
// };

export default (props) => {

  // let [logoStyles, setLogoStyles] = useState(LOGO_STATE);
  //let [initialLogoStyles, setInitialLogoStyles] = useState(INITIAL_LOGO_STATE);
  let [collapsed, setCollapsed] = useState(false);
  let [siderMargin, setSiderMargin] = useState(200);

  const toggle = () => {
    setCollapsed(!collapsed);

    if (collapsed) {
      // setLogoStyles({...LOGO_STATE, display: 'block'});
      // setInitialLogoStyles({...INITIAL_LOGO_STATE, display: 'none'});
      return setSiderMargin(200)
    }

    // setLogoStyles({...LOGO_STATE, display: 'none'});
    // setInitialLogoStyles({...INITIAL_LOGO_STATE, display: 'block'});
    setSiderMargin(80);
  };

  const goTo = (e) => Router.push(e.key);

  return (
    <Layout>
      <Sider
        className="sidebar-bg-color"
        style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0,}}
        trigger={null}
        collapsible
        collapsed={collapsed}>
        <div className="logo">
          <h2 className="">Fleet</h2>
          {/*<p id="initialLogo" style={initialLogoStyles}>W</p>*/}
        </div>
        <Menu onClick={goTo} style={menuStyles} theme="dark" mode="inline" defaultSelectedKeys={['1']}>

          {/* TODO For each this shit. */}
          <Menu.Item key="dashboard">
            <Icon type="dashboard"/>
            <span className="nav-text">Dashboard</span>
          </Menu.Item>
          <SubMenu
            key="access-control"
            title={<span><Icon type="lock"/><span>Access Control</span></span>}>
            <Menu.Item key="/user">
              <Icon type="user"/>
              <span className="nav-text">Users</span>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="/rental">
            <Icon type="schedule"/>
            <span className="nav-text">Rentals</span>
          </Menu.Item>
          <Menu.Item key="/driver">
            <Icon type="user"/>
            <span className="nav-text">Drivers</span>
          </Menu.Item>
          <Menu.Item key="/part">
            <Icon type="tool"/>
            <span className="nav-text">Parts</span>
          </Menu.Item>
          <Menu.Item key="/taxi">
            <Icon type="car"/>
            <span className="nav-text">Taxi</span>
          </Menu.Item>
          <Menu.Item key="/logout">
            <Icon type="logout"/>
            <span className="nav-text">Logout</span>
          </Menu.Item></Menu>
      </Sider>

      <Layout style={{marginLeft: siderMargin}}>
        <Header style={headerStyles}>
          <Icon
            className="trigger"
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={toggle}
          />
        </Header>
        <Content style={{
          margin: '80px 16px 0', padding: 24, background: '#fff', minHeight: 280, overflow: 'initial'
        }}>
          {props.children}
        </Content>
        <Footer className="">
          <Row>
            <Col lg={24}>
            <p className="text-right">
              <Text underline>Fleet Management v1.0</Text><br/>
              <span>Copyright 2019</span>
            </p>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </Layout>
  )
}
