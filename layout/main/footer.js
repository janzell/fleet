import {Typography, Row, Col, Layout} from 'antd';

const {Text} = Typography;
const {Footer} = Layout;

const FooterBlock = () => {
  return (
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
  )
};

export default FooterBlock;
