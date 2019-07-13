import {useState} from 'react';
import {Row, Pagination, Table, Col, Icon, Input, Tag, Alert, Modal, PageHeader, Button, Divider} from 'antd';

import MainLayout from '../../layout/main';
import {DRIVERS_SUBSCRIPTION} from "./drivers-gql";
import {Subscription} from 'react-apollo';
import DriverModal from './driver-modal';

const {Search} = Input;

const DriverList = props => {

  // States
  const [mode, setMode] = useState('add');
  const [driver, setDriver] = useState({});
  const [modalVisibility, showModalVisibility] = useState(false);

  const handleEditMode = driver => {
    setMode('edit');
    setDriver(driver);
    showModalVisibility(true);
  };

  // Methods
  const columns = [
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'License Number',
      dataIndex: 'license_number',
      key: 'license_number'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <span>
           <Tag color="#87d068">active
           </Tag>
      </span>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => handleEditMode(record)}>Edit</a>
          <Divider type="vertical"/>
          <a href="javascript:;">Delete</a>
        </span>
      )
    },
  ];

  const DriversList = (options) => (
    <Subscription subscription={DRIVERS_SUBSCRIPTION} variables={options} fetchPolicy="network-only">
      {({data, loading, error}) => {
        if (error) return `Error! ${error.message}`;
        return (
          <>
            <Table loading={loading} pagination={{pageSize: 15}} rowKey="id" dataSource={!loading && data.drivers}
                   columns={columns}/>
          </>
        )
      }}
    </Subscription>
  );

  return (
    <MainLayout>
      <div className="page drivers">
        <Row>
          <div className="right-content">
            <PageHeader title="Driver's List">
              <div className="wrap">
                <div className="content">List of drivers</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => showModalVisibility(true)} type="primary"><Icon type="plus"/>Driver</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => console.log(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            <Alert className="mb-10" message="Informational Notes" type="info" showIcon/>
            {DriversList({limit: 15, offset: 10})}
            <DriverModal driver={driver} mode={mode} visible={modalVisibility} onOk={() => showModalVisibility(false)}
                            onCancel={() => showModalVisibility(false)}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default DriverList;
