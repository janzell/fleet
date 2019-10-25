import {useEffect, useState} from 'react';
import {Row, Table, Col, Icon, Input, PageHeader, Button, Divider} from 'antd';

import MainLayout from '../../layout/main';
import {Query} from 'react-apollo';
import DriverDrawer from './driver-drawer';
import DeleteConfirmationModal from './../../components/modal/delete-confirmation-modal';
import {withApollo} from "react-apollo";

import {GET_DRIVERS_LIST, DELETE_DRIVER, GET_TOTAL_COUNT} from "./drivers-gql";

import columnsTitleFormatter from "../../utils/table-columns-formatter";
import useNotificationWithIcon from '../../hooks/use-notification'
import useColumnFormatter from "../../hooks/table/use-column-formatter";

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

  const [drawerVisibility, showDrawerVisibility] = useState(false);
  const [confirmVisibility, showConfirmVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, setSearchText] = useState('');

  const handleFormMode = driver => {
    setMode('edit');
    setDriver(driver);
    showDrawerVisibility(true);
  };

  const showOrCancelConfirmModal = (visible, id) => {
    setToBeDeletedId(id);
    showConfirmVisibility(visible);
  };

  const cancelModal = () => {
    setMode('add');
    setDriver({});
    showDrawerVisibility(false);
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
    useNotificationWithIcon('success', 'Success', 'Driver has been deleted successfully');
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
    onOk: () => showDrawerVisibility(false),
    onCancel: () => cancelModal()
  };

  const DriversList = (options) => (
    <Query query={GET_DRIVERS_LIST} variables={options} fetchPolicy="network-only">
      {({data, loading, error}) => {
        if (error) return `Error! )${error.message}`;
        return (
          <>
            <Table loading={loading}
                   pagination={{pageSize: 15, onChange: (page) => handlePaginate(page), total: totalCount}} rowKey="id"
                   dataSource={(!loading && data.drivers) || []}
                   columns={columns}/>
          </>
        )
      }}
    </Query>
  );

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
                  <Button key="1" onClick={() => showDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Driver</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            {DriversList(listOptions)}

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
