import {useEffect, useState} from 'react';
import {Row, Col, Icon, Input, PageHeader, Button} from 'antd';

import MainLayout from '../../layout/main';
import CaseNumberDrawer from './case-numbers-drawer';
import DeleteConfirmationModal from '../../components/modal/delete-confirmation-modal';
import {withApollo} from "react-apollo";

import {GET_CASE_NUMBER_LIST, DELETE_CASE_NUMBER, GET_TOTAL_COUNT} from "./../../queries/case-numbers-gql";

import {successNotification} from '../../hooks/use-notification'
import useColumnFormatter from "../../hooks/table/use-column-formatter";
import ResourceQueryList from "../../components/resource-query-list";

const {Search} = Input;

const CaseNumberList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};
  const fields = ['number', 'notes', 'expired_at', 'created_at', 'updated_at'];

  const [mode, setMode] = useState('add');
  const [caseNumber, setCaseNumber] = useState({});

  const [drawerVisibility, showDrawerVisibility] = useState(false);
  const [confirmVisibility, showConfirmVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, setSearchText] = useState('');

  const handleFormMode = caseNumber => {
    setMode('edit');
    setCaseNumber(caseNumber);
    showDrawerVisibility(true);
  };

  const showOrCancelConfirmModal = (visible, id) => {
    setToBeDeletedId(id);
    showConfirmVisibility(visible);
  };

  const cancelModal = () => {
    setMode('add');
    setCaseNumber({});
    showDrawerVisibility(false);
  };

  // todo: we can make this as custom hooks for deleting resource;
  const handleDelete = async () => {
    await props.client.mutate({
      mutation: DELETE_CASE_NUMBER,
      variables: {
        number: toBeDeletedId
      },
      refetchQueries: [{query: GET_CASE_NUMBER_LIST, variables: listOptions}]
    });

    showOrCancelConfirmModal(false, null);
    successNotification('Case Number has been deleted successfully');
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
        {number: paramValue},
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
      .then(({data}) => setTotalCount(data.case_numbers_aggregate.aggregate.count));
  };

  // Effects
  useEffect(() => refreshResult(), [searchText]);
  useEffect(() => handleTotalCount(), []);

  const drawerProps = {
    title: (mode === 'edit') ? 'Edit Case Number' : 'New Case Number',
    listOptions,
    caseNumber,
    mode,
    visible: drawerVisibility,
    onOk: () => showDrawerVisibility(false),
    onCancel: () => cancelModal()
  };


  return (
    <MainLayout>
      <div className="page body-numbers">
        <Row>
          <div className="right-content">

            {/* make it reusable component? */}
            <PageHeader title="Case Numbers">
              <div className="wrap">
                <div className="content">List of case numbers</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => showDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Case Number</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            <ResourceQueryList {...{
              columns,
              query: GET_CASE_NUMBER_LIST,
              listOptions,
              handlePaginate,
              totalCount,
              resource: 'case_numbers'
            }}/>

            <DeleteConfirmationModal visible={confirmVisibility}
                                     onOk={() => handleDelete()}
                                     onCancel={() => showOrCancelConfirmModal(false, null)}/>

            <CaseNumberDrawer {...drawerProps}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(CaseNumberList);
