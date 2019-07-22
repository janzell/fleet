import {useEffect, useMemo, useState} from 'react';
import {Row, Modal, Table, Col, Icon, Input, Tag, Alert, PageHeader, Button, Divider} from 'antd';

import MainLayout from '../../layout/main';
import {Subscription} from 'react-apollo';
import DriverModal from './driver-modal';
import ConfirmModal from './../../components/confirm-modal';
import {withApollo} from "react-apollo";

import {DRIVERS_SUBSCRIPTION, DELETE_DRIVER, GET_TOTAL_COUNT} from "./drivers-gql";

const {Search} = Input;

/**
 * Driver List Component.
 *
 * @param props
 * @return {*}
 * @constructor
 */
const DriverList = props => {

  const [mode, setMode] = useState('add');
  const [driver, setDriver] = useState({});
  const [modalVisibility, showModalVisibility] = useState(false);
  const [confirmVisibility, showConfirmVisibility] = useState(false);
  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState({limit: 15, offset: 10, order_by: {created_at: 'desc'}});


  // handle the edit/add mode
  const handleEditMode = driver => {
    setMode('edit');
    setDriver(driver);
    showModalVisibility(true);
  };

  // show or cancel confirm modal
  const showOrCancelConfirmModal = (visible, id) => {
    setToBeDeletedId(id);
    showConfirmVisibility(visible);
  };

  // cancel driver modal
  const cancelDriverModal = () => {
    setMode('add');
    setDriver({});
    showModalVisibility(false);
  };

  // handle delete
  const handleDelete = async () => {
    await props.client.mutate({
      mutation: DELETE_DRIVER,
      variables: {
        id: toBeDeletedId
      }
    });

    showOrCancelConfirmModal(false, null);
  };

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
        <Tag color="#87d068">active</Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at'
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => handleEditMode(record)}>Edit</a>
          <Divider type="vertical"/>
          <a href="javascript:;" onClick={() => showOrCancelConfirmModal(true, record.id)}>Delete</a>
        </span>
      )
    },
  ];

  useEffect(() => {
    props.client.query({query: GET_TOTAL_COUNT})
      .then(res => setTotalCount(res.data.drivers_aggregate.aggregate.count));
  });

  const DriversList = (options) => (
    <Subscription subscription={DRIVERS_SUBSCRIPTION} variables={options} fetchPolicy="network-only">
      {({data, loading, error}) => {
        if (error) return `Error! ${error.message}`;
        return (
          <>
            <Table loading={loading} pagination={{pageSize: 15, total: totalCount}} rowKey="id"
                   dataSource={(!loading && data.drivers) || []}
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
                  <Button key="1" onClick={() => showModalVisibility(true)} type="primary"><Icon
                    type="plus"/>Driver</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => console.log(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            <Alert className="mb-10" message="Informational Notes" type="info" showIcon/>

            {DriversList(listOptions)}

            <ConfirmModal
              width='500'
              visible={confirmVisibility}
              centered
              content="Are you sure you want to delete this record?"
              okText='Yes'
              cancelText='Cancel'
              onCancel={() => showOrCancelConfirmModal(false, null)}
              onOk={() => handleDelete()}
            />

            <DriverModal driver={driver} mode={mode} visible={modalVisibility} onOk={() => showModalVisibility(false)}
                         onCancel={() => cancelDriverModal()}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(DriverList);
