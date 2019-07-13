import {useEffect, useState} from 'react';
import {Row, Icon} from 'antd';
import MainLayout from '../../layout/main';

const Dashboard = props => {
  return (
    <MainLayout>
      <div className="settings-container">
        <Row className="edit-profile-header">
          <a><Icon type="left"/> Back to Dashboard</a>
        </Row>
        <Row>
          <div className="right-content">
          </div>
        </Row>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
