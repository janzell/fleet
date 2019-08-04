import {useEffect, useMemo, useState} from 'react';
import {Row, Modal, Table, Col, Icon, Input, Tag, Alert, PageHeader, Button, Divider} from 'antd';

import MainLayout from '../../layout/main';
import {Query} from 'react-apollo';
import TaxiModal from './taxi-modal';
import ConfirmModal from './../../components/confirm-modal';
import {withApollo} from "react-apollo";

import {GET_TAXIS_LIST, DELETE_TAXI, GET_TOTAL_COUNT} from "./taxi-gql";
import columnsTitleFormatter from "../../utils/table-columns-formatter";

const {Search} = Input;

/**
 * Taxi List Component.
 *
 * @param props
 * @return {*}
 * @constructor
 */
const TaxiList = props => {
  // use memo on this
  const listOptionsDefault = {limit: 15, offset: 10, order_by: {created_at: 'desc'}};

  const [mode, setMode] = useState('add');
  const [taxi, setTaxi] = useState({});
  const [modalVisibility, showModalVisibility] = useState(false);
  const [confirmVisibility, showConfirmVisibility] = useState(false);
  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);

  // handle the edit/add mode
  const handleFormMode = taxi => {
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

  // Pagination.
  const handlePaginate = (page) => {
    const offset = page * 15;
    setListOptions({...listOptions, offset});
  };

  const fields = ['brand', 'model', 'plate_number', 'mileage', 'planned_maintenance', 'malfunctions', 'notes'];

  // handle columns
  const columns = columnsTitleFormatter(fields, [
    {
      title: 'status',
      key: 'status',
      dataIndex: 'status',
      render: status => {
        const color = (status === 'maintenance') ? 'red' : 'green';
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        )
      }
    }, {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: 110,
      render: (text, record) => (
        <span>
       <a href="javascript:;" onClick={() => handleFormMode(record)}><Icon type="eye"/></a>
        <Divider type="vertical"/>
        <a href="javascript:;" onClick={() => handleFormMode(record)}><Icon type="edit"/></a>
        <Divider type="vertical"/>
        <a href="javascript:;" onClick={() => showOrCancelConfirmModal(true, record.id)}><Icon type="delete"/></a>
      </span>
      )
    }]);

  useEffect(() => {
    props.client.query({query: GET_TOTAL_COUNT})
      .then(res => setTotalCount(res.data.taxis_aggregate.aggregate.count));
  });

  const TaxisList = (options) => (
    <Query query={GET_TAXIS_LIST} variables={options} fetchPolicy="network-only">
      {({data, loading, error}) => {
        if (error) return `Error! ${error.message}`;
        return (
          <>
            <Table pagination={{pageSize: 15, onChange: (page) => handlePaginate(page), total: totalCount}} rowKey="id"
                   dataSource={(!loading && data.taxis) || []}
                   columns={columns}/>
          </>
        )
      }}
    </Query>
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
