import {useEffect, useState} from 'react';
import {Row, Col, Icon, Input, PageHeader, Button} from 'antd';

import MainLayout from '../../layout/main';
import BodyNumberDrawer from './body-numbers-drawer';
import DeleteConfirmationModal from '../../components/modal/delete-confirmation-modal';
import {withApollo} from "react-apollo";

import {GET_BODY_NUMBER_LIST, DELETE_BODY_NUMBER, GET_TOTAL_COUNT} from "./../../queries/body-numbers-gql";

import {errorNotification, successNotification} from '../../hooks/use-notification'
import {useColumnFormatter} from "../../hooks/use-column-formatter";
import ResourceQueryList from "../../components/resource-query-list";

const {Search} = Input;

const BodyNumberList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};
  const fields = ['number', 'notes', 'created_at', 'updated_at'];

  const [mode, setMode] = useState('add');
  const [bodyNumber, setBodyNumber] = useState({});

  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [confirmVisibility, setConfirmModalVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, setSearchText] = useState('');

  const handleFormMode = bodyNumber => {
    setMode('edit');
    setBodyNumber(bodyNumber);
    setDrawerVisibility(true);
  };

  const showOrCancelConfirmModal = (visible, record) => {
    setToBeDeletedId(record.number);
    setConfirmModalVisibility(visible);
  };

  const cancelDrawer = () => {
    setMode('add');
    setBodyNumber({});
    setDrawerVisibility(false);
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
    onOk: () => setDrawerVisibility(false),
    onCancel: () => cancelDrawer()
  };


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
                  <Button key="1" onClick={() => setDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Body Number</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            <ResourceQueryList {...{
              columns,
              query: GET_BODY_NUMBER_LIST,
              listOptions,
              handlePaginate,
              totalCount,
              resource: 'body_numbers'
            }}/>

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
