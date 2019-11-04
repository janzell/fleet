import {useEffect, useState} from 'react';
import {Row, Table, Col, Icon, Input, PageHeader, Button} from 'antd';

import MainLayout from '../../layout/main';
import YearModelDrawer from './year-model-drawer';
import DeleteConfirmationModal from '../../components/modal/delete-confirmation-modal';
import {withApollo} from "react-apollo";

import {GET_YEAR_MODEL_LIST, DELETE_YEAR_MODEL, GET_TOTAL_COUNT} from "./../../queries/year-model-gql";

import {successNotification} from '../../hooks/use-notification'
import {useColumnFormatter} from "../../hooks/use-column-formatter";
import ResourceQueryList from "../../components/resource-query-list";

const {Search} = Input;

const YearModelList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};
  const fields = ['name', 'notes', 'created_at', 'updated_at'];

  const [mode, setMode] = useState('add');
  const [yearModel, setYearModel] = useState({});

  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [confirmVisibility, setConfirmModalVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, setSearchText] = useState('');

  const handleFormMode = yearModel => {
    setMode('edit');
    setYearModel(yearModel);
    setDrawerVisibility(true);
  };

  const showOrCancelConfirmModal = (visible, yearModel) => {
    setToBeDeletedId(yearModel.name);
    setConfirmModalVisibility(visible);
  };

  const cancelDrawer = () => {
    setMode('add');
    setYearModel({});
    setDrawerVisibility(false);
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
    successNotification('Year model has been deleted successfully');
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
    onOk: () => setDrawerVisibility(false),
    onCancel: () => cancelDrawer()
  };

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
                  <Button key="1" onClick={() => setDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Year Model</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            <ResourceQueryList {...{
              columns,
              query: GET_YEAR_MODEL_LIST,
              listOptions,
              handlePaginate,
              totalCount,
              resource: 'year_models'
            }}/>

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
