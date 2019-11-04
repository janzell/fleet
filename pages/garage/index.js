import {useEffect, useState} from 'react';
import {Row, Col, Icon, Input, PageHeader, Button} from 'antd';

import MainLayout from '../../layout/main';
import GarageDrawer from './garage-drawer';
import DeleteConfirmationModal from '../../components/modal/delete-confirmation-modal';
import {withApollo} from "react-apollo";

import {GET_GARAGE_LIST, DELETE_GARAGE, GET_TOTAL_COUNT} from "./../../queries/garage-gql";

import {successNotification} from '../../hooks/use-notification'
import {useColumnFormatter} from "../../hooks/use-column-formatter";
import ResourceQueryList from "../../components/resource-query-list";

const {Search} = Input;

const GarageList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};
  const fields = ['name', 'address', 'created_at', 'updated_at'];

  const [mode, setMode] = useState('add');
  const [garage, setGarage] = useState({});

  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [confirmVisibility, setConfirmModalVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, setSearchText] = useState('');

  const handleFormMode = garage => {
    setMode('edit');
    setGarage(garage);
    setDrawerVisibility(true);
  };

  const showOrCancelConfirmModal = (visible, garage) => {
    setToBeDeletedId(garage.id);
    setConfirmModalVisibility(visible);
  };

  const cancelDrawer = () => {
    setMode('add');
    setGarage({});
    setDrawerVisibility(false);
  };

  // todo: we can make this as custom hooks for deleting resource;
  const handleDelete = async () => {
    await props.client.mutate({
      mutation: DELETE_GARAGE,
      variables: {
        id: toBeDeletedId
      },
      refetchQueries: [{query: GET_GARAGE_LIST, variables: listOptions}]
    });

    showOrCancelConfirmModal(false, null);
    successNotification('Garage has been deleted successfully');
  };

  // handles the paginate action of the table.
  const handlePaginate = (page) => {
    const offset = page * 15;
    setListOptions({...listOptions, offset});
  };

  const refreshResult = () => {
    const paramValue = {_ilike: `%${searchText}%`};
    const where = {
      _or: [
        {name: paramValue},
      ]
    };
    setListOptions({...listOptions, ...{offset: 0, where}});
    handleTotalCount(where);
  };

  // Search
  const handleSearch = (text) => setSearchText(text)

  const columns = useColumnFormatter(fields, handleFormMode, showOrCancelConfirmModal);

  // Total Count
  const handleTotalCount = (where = null) => {
    const q = where != null ? {query: GET_TOTAL_COUNT, variables: {where}} : {query: GET_TOTAL_COUNT};

    props.client.query(q)
      .then(({data}) => setTotalCount(data.garages_aggregate.aggregate.count));
  };

  // effects
  useEffect(() => refreshResult(), [searchText]);
  useEffect(() => handleTotalCount(), []);

  const drawerProps = {
    title: (mode === 'edit') ? 'Edit Garage' : 'New Garage',
    listOptions,
    garage,
    mode,
    visible: drawerVisibility,
    onOk: () => setDrawerVisibility(false),
    onCancel: () => cancelDrawer()
  };

  return (
    <MainLayout>
      <div className="page body-numbers">
        <Row>
          <div className="right-content">

            {/* make it reusable component? */}
            <PageHeader title="Garages">
              <div className="wrap">
                <div className="content">List of garages</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => setDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Garage</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            <ResourceQueryList {...{
              columns,
              query: GET_GARAGE_LIST,
              listOptions,
              handlePaginate,
              totalCount,
              resource: 'garages'
            }}/>

            <DeleteConfirmationModal visible={confirmVisibility}
                                     onOk={() => handleDelete()}
                                     onCancel={() => showOrCancelConfirmModal(false, null)}/>

            <GarageDrawer {...drawerProps}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(GarageList);
