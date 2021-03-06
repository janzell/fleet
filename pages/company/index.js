import {useEffect, useState} from 'react';
import {Row, Col, Icon, Input, PageHeader, Button} from 'antd';

import MainLayout from '../../layout/main';
import CompanyDrawer from './company-drawer';
import DeleteConfirmationModal from './../../components/modal/delete-confirmation-modal';
import {withApollo} from "react-apollo";

import {GET_COMPANIES_LIST, DELETE_COMPANY, GET_TOTAL_COUNT} from "./../../queries/company-gql";

import {successNotification} from '../../hooks/use-notification'
import {useColumnFormatter} from "../../hooks/use-column-formatter";
import ResourceQueryList from "../../components/resource-query-list";

const {Search} = Input;

const CompanyList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};
  const fields = ['name', 'address', 'created_at', 'updated_at'];

  const [mode, setMode] = useState('add');
  const [company, setCompany] = useState({});

  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [confirmVisibility, setConfirmModalVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, setSearchText] = useState('');

  const handleFormMode = company => {
    setMode('edit');
    setCompany(company);
    setDrawerVisibility(true);
  };

  const showOrCancelConfirmModal = (visible, company) => {
    setToBeDeletedId(company.id);
    setConfirmModalVisibility(visible);
  };

  const cancelDrawer = () => {
    setMode('add');
    setCompany({});
    setDrawerVisibility(false);
  };

  // TODO:
  const handleDelete = async () => {
    await props.client.mutate({
      mutation: DELETE_COMPANY,
      variables: {
        id: toBeDeletedId
      },
      refetchQueries: [{query: GET_COMPANIES_LIST, variables: listOptions}]
    });

    showOrCancelConfirmModal(false, null);
    successNotification('Company has been deleted successfully');
  };

  // TODO:
  const handlePaginate = (page) => {
    const offset = page * 15;
    setListOptions({...listOptions, offset});
  };

  const refreshResult = () => {
    const paramValue = {_ilike: `%${searchText}%`};
    const where = {
      _or: [
        {name: paramValue}
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
      .then(({data}) => setTotalCount(data.companies_aggregate.aggregate.count));
  };

  // Get the total number of companies.
  useEffect(() => refreshResult(), [searchText]);
  useEffect(() => handleTotalCount(), []);

  const drawerProps = {
    title: (mode === 'edit') ? 'Edit Company' : 'New Company',
    listOptions,
    company,
    mode,
    visible: drawerVisibility,
    onOk: () => setDrawerVisibility(false),
    onCancel: () => cancelDrawer()
  };

  return (
    <MainLayout>
      <div className="page companies">
        <Row>
          <div className="right-content">

            {/* make it reusable component? */}
            <PageHeader title="Company">
              <div className="wrap">
                <div className="content">List of companies</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => setDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Company</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>


            <ResourceQueryList {...{
              columns,
              query: GET_COMPANIES_LIST,
              listOptions,
              handlePaginate,
              totalCount,
              resource: 'companies'
            }}/>

            <DeleteConfirmationModal
              visible={confirmVisibility}
              onOk={() => handleDelete()}
              onCancel={() => showOrCancelConfirmModal(false, null)}/>

            <CompanyDrawer {...drawerProps}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(CompanyList);
