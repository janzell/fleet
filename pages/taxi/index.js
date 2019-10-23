import {useEffect, useState} from 'react';
import {Row, Table, Col, Icon, Input, Tag, notification, PageHeader, Button} from 'antd';

import MainLayout from '../../layout/main';
import {Query} from 'react-apollo';
import TaxiDrawer from './taxi-drawer';
import {withApollo} from "react-apollo";

import {GET_TAXIS_LIST, DELETE_TAXI, GET_TOTAL_COUNT} from "./taxi-gql";
import DeleteConfirmationModal from "../../components/modal/delete-confirmation-modal";
import useColumnFormatter from "../../hooks/table/use-column-formatter";

const {Search} = Input;

/**
 * Taxi List Component.
 *
 * @param props
 * @return {*}
 * @constructor
 */
const TaxiList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};

  const [mode, setMode] = useState('add');
  const [taxi, setTaxi] = useState({});

  const [drawerVisibility, showDrawerVisibility] = useState(false);
  const [confirmVisibility, showConfirmVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, setSearchText] = useState('');

  // todo: make this shit as a custom hooks.
  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message,
      description
    });
  };

  // handle the edit/add mode
  const handleFormMode = taxi => {
    setMode('edit');
    setTaxi(taxi);
    showDrawerVisibility(true);
  };

  // show or cancel confirm modal
  const showOrCancelConfirmModal = (visible, id) => {
    setToBeDeletedId(id);
    showConfirmVisibility(visible);
  };

  // cancel taxi modal
  const cancelModal = () => {
    setMode('add');
    setTaxi({});
    showDrawerVisibility(false);
  };

  // todo: we can make this as custom hooks for deleting resource;
  const handleDelete = async () => {
    await props.client.mutate({
      mutation: DELETE_TAXI,
      variables: {
        id: toBeDeletedId
      },
      refetchQueries: [{query: GET_TAXIS_LIST, variables: listOptions}]
    });

    showOrCancelConfirmModal(false, null);
    openNotificationWithIcon('success', 'Success', 'Driver has been deleted successfully');
  };

  // Pagination.
  const handlePaginate = (page) => {
    const offset = page * 15;
    setListOptions({...listOptions, offset});
  };

  const fields = ['body_number', 'case_number', 'plate_number', 'acquired_at', 'engine_number', 'year_model', 'series.name'];

  const refreshResult = () => {
    const paramValue = {_ilike: `%${searchText}%`};
    const where = {
      _or: [
        {brand: paramValue},
        {plate_number: paramValue}
      ]
    };
    setListOptions({...listOptions, ...{offset: 0, where}});
    handleTotalCount(where);
  };

  // Search
  const handleSearch = (text) => {
    setSearchText(text);
    refreshResult(text);
  };

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

  // Total Count
  const handleTotalCount = (where = null) => {
    const q = where != null ? {query: GET_TOTAL_COUNT, variables: {where}} : {query: GET_TOTAL_COUNT};

    props.client.query(q)
      .then(({data}) => setTotalCount(data.taxis_aggregate.aggregate.count));
  };

  useEffect(() => {
    handleTotalCount();
  }, []);

  const drawerProps = {
    title: (mode === 'edit') ? 'Edit Taxi' : 'New Taxi',
    listOptions,
    taxi,
    mode,
    visible: drawerVisibility,
    onOk: () => showDrawerVisibility(false),
    onCancel: () => cancelModal()
  };

  const TaxisList = (options) => (
    <Query query={GET_TAXIS_LIST} variables={options} fetchPolicy="network-only">
      {({data, loading, error}) => {
        if (error) return `Error! ${error.message}`;
        return (
          <>
            <Table pagination={{pageSize: 15, onChange: (page) => handlePaginate(page), total: totalCount}}
                   rowKey="id"
                   expandedRowRender={record => <p style={{margin: 0}}><u>Notes:</u> {record.notes}</p>}
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
            <PageHeader title="Taxi List">
              <div className="wrap">
                <div className="content">List of taxis</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => showDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Taxi</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            {TaxisList(listOptions)}

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
