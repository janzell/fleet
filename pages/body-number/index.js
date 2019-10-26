import {useEffect, useState} from 'react';
import {Row, Table, Col, Icon, Input, PageHeader, Button} from 'antd';

import MainLayout from '../../layout/main';
import {Query} from 'react-apollo';
import BodyNumberDrawer from './body-numbers-drawer';
import DeleteConfirmationModal from '../../components/modal/delete-confirmation-modal';
import {withApollo} from "react-apollo";

import {GET_BODY_NUMBER_LIST, DELETE_BODY_NUMBER, GET_TOTAL_COUNT} from "./body-numbers-gql";

import {errorNotification, successNotification} from '../../hooks/use-notification'
import useColumnFormatter from "../../hooks/table/use-column-formatter";

const {Search} = Input;

const BodyNumberList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};
  const fields = ['number', 'notes', 'created_at', 'updated_at'];

  const [mode, setMode] = useState('add');
  const [bodyNumber, setBodyNumber] = useState({});

  const [drawerVisibility, showDrawerVisibility] = useState(false);
  const [confirmVisibility, showConfirmVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, setSearchText] = useState('');

  const handleFormMode = bodyNumber => {
    setMode('edit');
    setBodyNumber(bodyNumber);
    showDrawerVisibility(true);
  };

  const showOrCancelConfirmModal = (visible, record) => {
    setToBeDeletedId(record.number);
    showConfirmVisibility(visible);
  };

  const cancelModal = () => {
    setMode('add');
    setBodyNumber({});
    showDrawerVisibility(false);
  };

  // TODO: new custom hook
  const handleDelete = async () => {
    const result = await props.client.mutate({
      mutation: DELETE_BODY_NUMBER,
      variables: {
        number: toBeDeletedId
      },
      refetchQueries: [{query: GET_BODY_NUMBER_LIST, variables: listOptions}]
    });


    if (result) {
      showOrCancelConfirmModal(false, toBeDeletedId);
      successNotification('Body Number has been deleted successfully');
    } else {
      errorNotification(`Failed to deleted body number.`)
    }
  };

  // Paginate
  const handlePaginate = (page) => {
    const offset = page * 15;
    setListOptions({...listOptions, offset});
  };


  const refreshResult = () => {
    const paramValue = {_ilike: `%${searchText}%`};
    const where = {
      _or: [
        {number: paramValue},
      ]
    };
    setListOptions({...listOptions, ...{offset: 0, where}});
    handleTotalCount(where);
  };

  // Search
  const handleSearch = text => setSearchText(text);

  // Fields
  const columns = useColumnFormatter(fields, handleFormMode, showOrCancelConfirmModal);

  // Count
  const handleTotalCount = (where = null) => {
    const q = where != null ? {query: GET_TOTAL_COUNT, variables: {where}} : {query: GET_TOTAL_COUNT};

    props.client.query(q)
      .then(({data}) => setTotalCount(data.body_numbers_aggregate.aggregate.count));
  };

  // Effects
  useEffect(() => refreshResult(), [searchText]);
  useEffect(() => handleTotalCount(), []);

  const drawerProps = {
    title: (mode === 'edit') ? 'Edit Body Number' : 'New Body Number',
    listOptions,
    bodyNumber,
    mode,
    visible: drawerVisibility,
    onOk: () => showDrawerVisibility(false),
    onCancel: () => cancelModal()
  };

  const BodyNumberList = (options) => (
    <Query query={GET_BODY_NUMBER_LIST} variables={options} fetchPolicy="network-only">
      {({data, loading, error}) => {
        if (error) return `Error! )${error.message}`;
        return (
          <>
            <Table loading={loading}
                   pagination={{pageSize: 15, onChange: (page) => handlePaginate(page), total: totalCount}}
                   rowKey="number"
                   dataSource={(!loading && data.body_numbers) || []}
                   columns={columns}/>
          </>
        )
      }}
    </Query>
  );

  return (
    <MainLayout>
      <div className="page body-numbers">
        <Row>
          <div className="right-content">

            {/* make it reusable component? */}
            <PageHeader title="Body Numbers">
              <div className="wrap">
                <div className="content">List of body numbers</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => showDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Body Number</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            {BodyNumberList(listOptions)}

            <DeleteConfirmationModal visible={confirmVisibility}
                                     onOk={() => handleDelete()}
                                     onCancel={() => showOrCancelConfirmModal(false, null)}/>

            <BodyNumberDrawer {...drawerProps}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(BodyNumberList);
