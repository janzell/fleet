import {Row, Col, Icon, Layout, Menu} from 'antd';

import {useState} from 'react';
import {Router} from '../../routes';

const {Header, Sider, Content} = Layout;

import TopBar from "./top-bar";
import ControlSubMenuList from  './control-submenu';
import FooterBlock from './footer';

import './index.css';


const headerStyles = {
  background: '#fff',
  padding: 0,
  position: 'fixed',
  zIndex: 1,
  width: '100%',
};

const layoutStyles = {
  margin: '80px 15px 0',
  padding: 10,
  minHeight: 280,
  overflow: 'initial'
};

const logoState = {
  width: 150,
  display: 'block',
};

const defaultLogoState = {
  textAlign: 'center',
  color: '#ce4257',
  fontSize: '20px',
  fontWeight: 'lighter',
  display: 'none',
};

export default (props) => {

  const [logoStyles, setLogoStyles] = useState(logoState);
  const [initialLogoStyles, setInitialLogoStyles] = useState(defaultLogoState);
  const [collapsed, setCollapsed] = useState(false);
  const [sideMargin, setSideMargin] = useState(200);
  const [activeNav, setActiveNav] = useState([]);

  const toggle = () => {
    setCollapsed(!collapsed);

    if (collapsed) {
      setLogoStyles({...logoState, display: 'block'});
      setInitialLogoStyles({...defaultLogoState, display: 'none'});
      return setSideMargin(200)
    }

    setLogoStyles({...logoState, display: 'none'});
    setInitialLogoStyles({...defaultLogoState, display: 'block'});
    setSideMargin(80);
  };

  const goTo = (e) => {
    setActiveNav([e.key]);
    Router.push(e.key);
  };

  const Logo = () => {
    return (
      <div className="logo">
        <h2 style={logoStyles}>Fleet</h2>
        <p id="initialLogo" style={initialLogoStyles}>F</p>
      </div>
    )
  };

  return (
    <Layout>
      <Sider
        className="sidebar-bg-color"
        style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0,}}
        trigger={null}
        collapsible
        collapsed={collapsed}>

        <Logo/>

        <Menu inlineIndent={15} onClick={goTo} theme="dark" mode="inline" selectedKeys={activeNav}>
          <Menu.Item key="/dashboard">
            <Icon type="dashboard"/>
            <span className="nav-text">Dashboard</span>
          </Menu.Item>

          <ControlSubMenuList/>

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

      <Layout style={{marginLeft: sideMargin}}>

        <Header style={headerStyles}>
          <Row type="flex" justify="end">
            <Col span={12}>
              <Icon
                className="trigger"
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={toggle}
              />

              <TopBar/>
            </Col>
            <Col offset={8} span={4}>
              <Icon type="bell"/>
            </Col>
          </Row>
        </Header>

        <Content style={layoutStyles}>
          {props.children}
        </ Content>

        <FooterBlock/>

      </Layout>
    </Layout>
  )
}
