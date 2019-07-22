import {useEffect, useMemo, useState} from 'react';
import {Row, Modal, Table, Col, Icon, Input, Tag, Alert, PageHeader, Button, Divider} from 'antd';

import MainLayout from '../../layout/main';
import {Subscription} from 'react-apollo';
import TaxiModal from './taxi-modal';
import ConfirmModal from './../../components/confirm-modal';
import {withApollo} from "react-apollo";

import {TAXIS_SUBSCRIPTION, DELETE_TAXI, GET_TOTAL_COUNT} from "./taxi-gql";

const {Search} = Input;

/**
 * Taxi List Component.
 *
 * @param props
 * @return {*}
 * @constructor
 */
const TaxiList = props => {

  const [mode, setMode] = useState('add');
  const [taxi, setTaxi] = useState({});
  const [modalVisibility, showModalVisibility] = useState(false);
  const [confirmVisibility, showConfirmVisibility] = useState(false);
  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState({limit: 15, offset: 10, order_by: {created_at: 'desc'}});


  // handle the edit/add mode
  const handleEditMode = taxi => {
    setMode('edit');
    setTaxi(taxi);
    showModalVisibility(true);
  };

  // show or cancel confirm modal
  const showOrCancelConfirmModal = (visible, id) => {
    setToBeDeletedId(id);
    showConfirmVisibility(visible);
  };

  // cancel taxi modal
  const cancelTaxiModal = () => {
    setMode('add');
    setTaxi({});
    showModalVisibility(false);
  };

  // handle delete
  const handleDelete = async () => {
    await props.client.mutate({
      mutation: DELETE_TAXI,
      variables: {
        id: toBeDeletedId
      }
    });

    showOrCancelConfirmModal(false, null);
  };

  const columns = [
    {
      title: 'Plate Number',
      dataIndex: 'plate_number',
      key: 'plate_number',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes'
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
      .then(res => setTotalCount(res.data.taxis_aggregate.aggregate.count));
  });

  const TaxisList = (options) => (
    <Subscription subscription={TAXIS_SUBSCRIPTION} variables={options} fetchPolicy="network-only">
      {({data, loading, error}) => {
        if (error) return `Error! ${error.message}`;
        return (
          <>
            <Table loading={loading} pagination={{pageSize: 15, total: totalCount}} rowKey="id"
                   dataSource={(!loading && data.taxis) || []}
                   columns={columns}/>
          </>
        )
      }}
    </Subscription>
  );

  return (
    <MainLayout>
      <div className="page taxis">
        <Row>
          <div className="right-content">
            <PageHeader title="Taxi's List">
              <div className="wrap">
                <div className="content">List of taxis</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => showModalVisibility(true)} type="primary"><Icon
                    type="plus"/>Taxi</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => console.log(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            <Alert className="mb-10" message="Informational Notes" type="info" showIcon/>

            {TaxisList(listOptions)}

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

            <TaxiModal taxi={taxi} mode={mode} visible={modalVisibility} onOk={() => showModalVisibility(false)}
                         onCancel={() => cancelTaxiModal()}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(TaxiList);
