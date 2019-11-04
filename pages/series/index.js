import {useEffect, useState} from 'react';
import {Row, Col, Icon, Input, PageHeader, Button} from 'antd';

import MainLayout from '../../layout/main';
import SeriesDrawer from './series-drawer';
import DeleteConfirmationModal from './../../components/modal/delete-confirmation-modal';
import {withApollo} from "react-apollo";

import {GET_SERIES_LIST, DELETE_SERIES, GET_TOTAL_COUNT} from "./../../queries/series-gql";

import {successNotification} from '../../hooks/use-notification'
import {useColumnFormatter} from "../../hooks/use-column-formatter";
import ResourceQueryList from "../../components/resource-query-list";

const {Search} = Input;

const SeriesList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};
  const fields = ['name', 'notes', 'created_at', 'updated_at'];

  const [mode, setMode] = useState('add');
  const [series, setSeries] = useState({});

  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [confirmVisibility, setConfirmModalVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, setSearchText] = useState('');

  const handleFormMode = series => {
    setMode('edit');
    setSeries(series);
    setDrawerVisibility(true);
  };

  const showOrCancelConfirmModal = (visible, series) => {
    setToBeDeletedId(series.id);
    setConfirmModalVisibility(visible);
  };

  const cancelDrawer = () => {
    setMode('add');
    setSeries({});
    setDrawerVisibility(false);
  };

  // todo: we can make this as custom hooks for deleting resource;
  const handleDelete = async () => {
    await props.client.mutate({
      mutation: DELETE_SERIES,
      variables: {
        id: toBeDeletedId
      },
      refetchQueries: [{query: GET_SERIES_LIST, variables: listOptions}]
    });

    showOrCancelConfirmModal(false, toBeDeletedId);
    successNotification('Series has been deleted successfully');
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
      .then(({data}) => setTotalCount(data.series_aggregate.aggregate.count));
  };

  // Get the total number of series.
  useEffect(() => refreshResult(), [searchText]);
  useEffect(() => handleTotalCount(), []);

  const drawerProps = {
    title: (mode === 'edit') ? 'Edit Series' : 'New Series',
    listOptions,
    series,
    mode,
    visible: drawerVisibility,
    onOk: () => setDrawerVisibility(false),
    onCancel: () => cancelDrawer()
  };


  return (
    <MainLayout>
      <div className="page series">
        <Row>
          <div className="right-content">
            <PageHeader title="Series">
              <div className="wrap">
                <div className="content">List of series</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => setDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Series</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            <ResourceQueryList {...{
              columns,
              query: GET_SERIES_LIST,
              listOptions,
              handlePaginate,
              totalCount,
              resource: 'series'
            }}/>

            <DeleteConfirmationModal visible={confirmVisibility}
                                     onOk={() => handleDelete()}
                                     onCancel={() => showOrCancelConfirmModal(false, null)}/>

            <SeriesDrawer {...drawerProps}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(SeriesList);
