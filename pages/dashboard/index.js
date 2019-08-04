import {useEffect, useState} from 'react';
import {Row, Icon, Progress, List, Tabs, Card, Col, Avatar} from 'antd';
import MainLayout from '../../layout/main';
import CardItem from './card-item';
import TinyBarChart from './charts/tiny-bar-chart';
import TinyLineChart from './charts/tiny-line-chart';
import TinyAreaChart from './charts/tiny-area-chart';
import DashboardBarChart from './charts/bar-chart';
import DashboardPieChart from './charts/radar-chart';

const {TabPane} = Tabs;

const Dashboard = props => {
  const [noTitleKey, setTitleKey] = useState('sales');

  const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];

  const contentListNoTitle = {
    sales: (
      <Row gutter={12}>
        <Col span={18}>
          <DashboardBarChart/>
        </Col>
        <Col span={6}>
          <div>Ranking</div>
          <ul>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
          </ul>
        </Col>
      </Row>
    ),
    visits: (
      <Row gutter={12}>
        <Col span={18}>
          <DashboardBarChart/>
        </Col>
        <Col span={6}>
          <div>Ranking</div>
          <ul>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
            <li><span>Test test</span> <span>345.343</span></li>
          </ul>
        </Col>
      </Row>
    ),
  };

  const cards = [
    {
      title: 'Car Dispatched',
      content: (
        <>
          <p>¥ 126,560</p>
          <TinyBarChart/>
        </>
      )
    }, {
      title: 'Under Maintenance',
      content: (
        <>
          <p>¥ 126,560</p>
          <TinyAreaChart/>
        </>
      )
    }, {
      title: 'Payments',
      content: (
        <>
          <p>¥ 126,560</p>
          <TinyLineChart/>
        </>
      )
    }, {
      title: 'Operational Effect',
      content: (
        <>
          <p>50%</p>
          <Progress percent={50} status="active" showInfo={false}/>
        </>
      )
    }];

  const cardItems = cards.map(card => {
    return (
      <Col span={6} order={4}>
        <CardItem {...card}/>
      </Col>
    );
  });

  return (
    <MainLayout>
      <div className="dashboard">
        <Row>
          <div className="right-content">
            <Row type="flex" className="mb-20" gutter={12}>
              {cardItems}
            </Row>
            <Row className="mb-20">
              <Card>
                <Tabs defaultActiveKey={noTitleKey} onChange={setTitleKey}>
                  <TabPane tab="Sales" key="sales">
                    {contentListNoTitle['sales']}
                  </TabPane>
                  <TabPane tab="Visits" key="visits">
                    {contentListNoTitle['visits']}
                  </TabPane>
                </Tabs>
              </Card>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Card title="Sample Card Title" bordered={false}>
                  <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                          title={<a href="https://ant.design">{item.title}</a>}
                          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Sample Card Title2" bordered={false}>
                  <DashboardPieChart/>
                </Card>
              </Col>
            </Row>
          </div>
        </Row>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
