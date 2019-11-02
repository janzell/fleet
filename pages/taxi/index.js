import {useEffect, useState} from 'react';
import {Row, Col, Icon, Input, Tag, PageHeader, Button} from 'antd';

import MainLayout from '../../layout/main';

import TaxiDrawer from './taxi-drawer';
import {withApollo} from "react-apollo";

import {GET_TAXIS_LIST, DELETE_TAXI, GET_TOTAL_COUNT} from "./../../queries/taxi-gql";

import DeleteConfirmationModal from "../../components/modal/delete-confirmation-modal";

import useColumnFormatter from "../../hooks/table/use-column-formatter";
import {successNotification} from '../../hooks/use-notification'

import ResourceQueryList from '../../components/resource-query-list';

const {Search} = Input;

const TaxiList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};

  const [mode, setMode] = useState('add');
  const [taxi, setTaxi] = useState({});

  const [drawerVisibility, showDrawerVisibility] = useState(false);
  const [confirmVisibility, showConfirmVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, handleSearch] = useState('');


  // handle the edit/add mode
  const handleFormMode = taxi => {
    setMode('edit');
    setTaxi(taxi);
    showDrawerVisibility(true);
  };

  // show or cancel confirm modal
  const showOrCancelConfirmModal = (visible, taxi) => {
    setToBeDeletedId(taxi.id);
    showConfirmVisibility(visible);
  };

  // cancel taxi modal
  const cancelModal = () => {
    setMode('add');
    setTaxi({});
    showDrawerVisibility(false);
  };

  // delete a resource
  const handleDelete = async () => {
    await props.client.mutate({
      mutation: DELETE_TAXI,
      variables: {
        id: toBeDeletedId
      },
      refetchQueries: [{query: GET_TAXIS_LIST, variables: listOptions}]
    });

    showOrCancelConfirmModal(false, toBeDeletedId);
    successNotification('Taxi record has been deleted successfully');
  };

  // pagination
  const handlePaginate = page => setListOptions({...listOptions, ...{offset: page * 15}});

  // refresh result.
  const refreshResult = () => {
    const paramValue = {_ilike: `%${searchText}%`};
    const where = {
      _or: [
        {body_number: paramValue},
        {plate_number: paramValue}
      ]
    };
    setListOptions({...listOptions, ...{offset: 0, where}});
    handleTotalCount(where);
  };

  // table fields
  const fields = ['body_number', 'case_number', 'plate_number', 'acquired_at', 'engine_number', 'year_model', 'series.name', 'created_at', 'updated_at'];
  const columns = useColumnFormatter(fields, handleFormMode, showOrCancelConfirmModal, [{
    title: 'status',
    key: 'status',
    dataIndex: 'status',
    render: status => {
      const color = (status === '24_HRS') ? 'blue' : 'green';
      return (
        <Tag color={color} key={status}>
          {status.toUpperCase()}
        </Tag>
      )
    }
  }]);

  const handleTotalCount = (where = null) => {
    const q = where != null ? {query: GET_TOTAL_COUNT, variables: {where}} : {query: GET_TOTAL_COUNT};

    props.client.query(q)
      .then(({data}) => setTotalCount(data.taxis_aggregate.aggregate.count));
  };

  useEffect(() => refreshResult(), [searchText]);
  useEffect(() => handleTotalCount(), []);

  const drawerProps = {
    title: (mode === 'edit') ? 'Edit Taxi' : 'New Taxi',
    listOptions,
    taxi,
    mode,
    visible: drawerVisibility,
    onOk: () => showDrawerVisibility(false),
    onCancel: () => cancelModal()
  };


  return (
    <MainLayout>
      <div className="page taxis">
        <Row>
          <div className="right-content">
            <PageHeader title="Taxi">
              <div className="wrap">
                <div className="content">List of taxis</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => showDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Taxi</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="search for body number or plate number" onSearch={value => handleSearch(value)}
                          enterButton/>
                </Col>
              </Row>
            </PageHeader>

            <ResourceQueryList {...{columns, query: GET_TAXIS_LIST, listOptions, handlePaginate, totalCount, resource: 'taxis'}}/>

            <DeleteConfirmationModal visible={confirmVisibility}
                                     onOk={() => handleDelete()}
                                     onCancel={() => showOrCancelConfirmModal(false, null)}/>

            <TaxiDrawer {...drawerProps}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(TaxiList);
