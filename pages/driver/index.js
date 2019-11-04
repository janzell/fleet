import {useEffect, useState} from 'react';
import {Row, Col, Icon, Input, PageHeader, Button} from 'antd';

import MainLayout from '../../layout/main';
import DriverDrawer from './driver-drawer';
import DeleteConfirmationModal from './../../components/modal/delete-confirmation-modal';
import {withApollo} from "react-apollo";

import {GET_DRIVERS_LIST, DELETE_DRIVER, GET_TOTAL_COUNT} from "./../../queries/drivers-gql";

import {successNotification} from '../../hooks/use-notification'
import {useColumnFormatter} from "../../hooks/use-column-formatter";
import ResourceQueryList from "../../components/resource-query-list";

const {Search} = Input;

/**
 * Driver List Component.
 *
 * @param props
 * @return {*}
 * @constructor
 */
const DriverList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};
  const fields = ['first_name', 'last_name', 'license_number', 'address', 'contact_number', 'created_at', 'updated_at'];

  const [mode, setMode] = useState('add');
  const [driver, setDriver] = useState({});

  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [confirmVisibility, setConfirmModalVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, setSearchText] = useState('');

  const handleFormMode = driver => {
    setMode('edit');
    setDriver(driver);
    setDrawerVisibility(true);
  };

  const showOrCancelConfirmModal = (visible, driver) => {
    setToBeDeletedId(driver.id);
    setConfirmModalVisibility(visible);
  };

  const cancelDrawer = () => {
    setMode('add');
    setDriver({});
    setDrawerVisibility(false);
  };

  // todo: we can make this as custom hooks for deleting resource;
  const handleDelete = async () => {
    await props.client.mutate({
      mutation: DELETE_DRIVER,
      variables: {
        id: toBeDeletedId
      },
      refetchQueries: [{query: GET_DRIVERS_LIST, variables: listOptions}]
    });

    showOrCancelConfirmModal(false, null);
    successNotification('Driver has been deleted successfully');
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
        {first_name: paramValue},
        {license_number: paramValue},
        {last_name: paramValue}
      ]
    };
    setListOptions({...listOptions, ...{offset: 0, where}});
    handleTotalCount(where);
  };

  // Search
  const handleSearch = (text) => setSearchText(text);

  const columns = useColumnFormatter(fields, handleFormMode, showOrCancelConfirmModal);

  // Total Count
  const handleTotalCount = (where = null) => {
    const q = where != null ? {query: GET_TOTAL_COUNT, variables: {where}} : {query: GET_TOTAL_COUNT};

    props.client.query(q)
      .then(({data}) => setTotalCount(data.drivers_aggregate.aggregate.count));
  };

  // Get the total number of drivers.
  useEffect(() => refreshResult(), [searchText]);
  useEffect(() => handleTotalCount(), []);

  const drawerProps = {
    title: (mode === 'edit') ? 'Edit Driver' : 'New Driver',
    listOptions,
    driver,
    mode,
    visible: drawerVisibility,
    onOk: () => setDrawerVisibility(false),
    onCancel: () => cancelDrawer()
  };

  return (
    <MainLayout>
      <div className="page drivers">
        <Row>
          <div className="right-content">

            {/* make it reusable component? */}
            <PageHeader title="Driver">
              <div className="wrap">
                <div className="content">List of drivers</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => setDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Driver</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>


            <ResourceQueryList {...{
              columns,
              query: GET_DRIVERS_LIST,
              listOptions,
              handlePaginate,
              totalCount,
              resource: 'drivers'
            }}/>

            <DeleteConfirmationModal visible={confirmVisibility}
                                     onOk={() => handleDelete()}
                                     onCancel={() => showOrCancelConfirmModal(false, null)}/>

            <DriverDrawer {...drawerProps}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(DriverList);
