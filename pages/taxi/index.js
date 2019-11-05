import {useEffect, useState} from 'react';
import {Row, Col, Icon, Input, Tag, PageHeader, Button} from 'antd';

import MainLayout from '../../layout/main';

import TaxiDrawer from './taxi-drawer';
import {withApollo} from "react-apollo";

import {GET_TAXIS_LIST, DELETE_TAXI, GET_TOTAL_COUNT} from "./../../queries/taxi-gql";

import DeleteConfirmationModal from "../../components/modal/delete-confirmation-modal";

import {successNotification} from '../../hooks/use-notification'

import ResourceQueryList from '../../components/resource-query-list';
import TaxiDetailDrawer from "./taxi-detail-drawer";
import useTaxiColumns from './use-tax-columns';

const {Search} = Input;

const TaxiList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};

  const [mode, setMode] = useState('add');
  const [taxi, setTaxi] = useState({});

  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [detailDrawerVisibility, setDetailDrawerVisibility] = useState(false);
  const [confirmVisibility, setConfirmModalVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, handleSearch] = useState('');


  // handle the edit/add mode
  const handleFormMode = (record, view = 'edit') => {
    setMode(view);
    setTaxi(record);

    (view === 'edit') ? setDrawerVisibility(true) : setDetailDrawerVisibility(true);
  };

  // show or cancel confirm modal
  const showOrCancelConfirmModal = (visible, taxi) => {
    setToBeDeletedId(taxi.id);
    setConfirmModalVisibility(visible);
  };


  // cancel taxi modal
  const cancelDrawer = () => {
    setMode('add');
    setTaxi({});
    setDrawerVisibility(false);
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


  // Table columns
  const [columns] = useTaxiColumns({handleFormMode, showOrCancelConfirmModal});

  // Record count.
  const handleTotalCount = (where = null) => {

    const q = where != null ? {query: GET_TOTAL_COUNT, variables: {where}} : {query: GET_TOTAL_COUNT};
    console.log(q);
    props.client.query(q).then(({data}) => {
      console.log(data);
      setTotalCount(data.taxis_aggregate.aggregate.count);
    });
  };

  // Effects
  useEffect(() => refreshResult(), [searchText]);

  const detailDrawerProps = {
    title: 'Vehicle Information',
    listOptions,
    taxi,
    mode,
    visible: detailDrawerVisibility,
    onOk: () => setDetailDrawerVisibility(false),
    onCancel: () => setDetailDrawerVisibility(false)
  };


  const drawerProps = {
    title: (mode === 'edit') ? 'Edit Taxi' : 'New Taxi',
    listOptions,
    taxi,
    mode,
    visible: drawerVisibility,
    onOk: () => setDrawerVisibility(false),
    onCancel: () => cancelDrawer()
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
                  <Button key="1" onClick={() => setDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Taxi</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="search for body number or plate number" onSearch={value => handleSearch(value)}
                          enterButton/>
                </Col>
              </Row>
            </PageHeader>

            <ResourceQueryList {...{
              columns,
              query: GET_TAXIS_LIST,
              listOptions,
              handlePaginate,
              totalCount,
              resource: 'taxis'
            }}/>

            <DeleteConfirmationModal visible={confirmVisibility}
                                     onOk={() => handleDelete()}
                                     onCancel={() => showOrCancelConfirmModal(false, null)}/>

            <TaxiDetailDrawer {...detailDrawerProps}/>

            <TaxiDrawer {...drawerProps}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(TaxiList);
