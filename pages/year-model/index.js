import {useEffect, useState} from 'react';
import {Row, Table, Col, Icon, Input, PageHeader, Button} from 'antd';

import MainLayout from '../../layout/main';
import {Query} from 'react-apollo';
import YearModelDrawer from './year-model-drawer';
import DeleteConfirmationModal from '../../components/modal/delete-confirmation-modal';
import {withApollo} from "react-apollo";

import {GET_YEAR_MODEL_LIST, DELETE_YEAR_MODEL, GET_TOTAL_COUNT} from "./year-model-gql";

import useNotificationWithIcon from '../../hooks/use-notification'
import useColumnFormatter from "../../hooks/table/use-column-formatter";

const {Search} = Input;

const YearModelList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};
  const fields = ['name', 'notes', 'created_at', 'updated_at'];

  const [mode, setMode] = useState('add');
  const [yearModel, setYearModel] = useState({});

  const [drawerVisibility, showDrawerVisibility] = useState(false);
  const [confirmVisibility, showConfirmVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, setSearchText] = useState('');

  const handleFormMode = yearModel => {
    setMode('edit');
    setYearModel(yearModel);
    showDrawerVisibility(true);
  };

  const showOrCancelConfirmModal = (visible, id) => {
    setToBeDeletedId(id);
    showConfirmVisibility(visible);
  };

  const cancelModal = () => {
    setMode('add');
    setYearModel({});
    showDrawerVisibility(false);
  };

  // todo: we can make this as custom hooks for deleting resource;
  const handleDelete = async () => {
    await props.client.mutate({
      mutation: DELETE_YEAR_MODEL,
      variables: {
        name: toBeDeletedId
      },
      refetchQueries: [{query: GET_YEAR_MODEL_LIST, variables: listOptions}]
    });

    showOrCancelConfirmModal(false, null);
    useNotificationWithIcon('success', 'Success', 'Year model has been deleted successfully');
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
  const handleSearch = (text) => setSearchText(text);

  const columns = useColumnFormatter(fields, handleFormMode, showOrCancelConfirmModal);

  // Total Count
  const handleTotalCount = (where = null) => {
    const q = where != null ? {query: GET_TOTAL_COUNT, variables: {where}} : {query: GET_TOTAL_COUNT};

    props.client.query(q)
      .then(({data}) => setTotalCount(data.year_models_aggregate.aggregate.count));
  };

  // Get the total number of yearModel.
  useEffect(() => refreshResult(), [searchText]);
  useEffect(() => handleTotalCount(), []);

  const drawerProps = {
    title: (mode === 'edit') ? 'Edit Year Model' : 'New Year Model',
    listOptions,
    yearModel,
    mode,
    visible: drawerVisibility,
    onOk: () => showDrawerVisibility(false),
    onCancel: () => cancelModal()
  };

  const YearModelList = (options) => (
    <Query query={GET_YEAR_MODEL_LIST} variables={options} fetchPolicy="network-only">
      {({data, loading, error}) => {
        if (error) return `Error! )${error.message}`;
        return (
          <>
            <Table loading={loading}
                   pagination={{pageSize: 15, onChange: (page) => handlePaginate(page), total: totalCount}}
                   rowKey="name"
                   dataSource={(!loading && data.year_models) || []}
                   columns={columns}/>
          </>
        )
      }}
    </Query>
  );

  return (
    <MainLayout>
      <div className="page year-models">
        <Row>
          <div className="right-content">

            {/* make it reusable component? */}
            <PageHeader title="Year Models">
              <div className="wrap">
                <div className="content">List of year models</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => showDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Year Model</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            {YearModelList(listOptions)}

            <DeleteConfirmationModal visible={confirmVisibility}
                                     onOk={() => handleDelete()}
                                     onCancel={() => showOrCancelConfirmModal(false, null)}/>

            <YearModelDrawer {...drawerProps}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(YearModelList);
