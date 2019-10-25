import {useEffect, useState} from 'react';
import {Row, Table, Col, Icon, Input, notification, PageHeader, Button, Divider} from 'antd';

import MainLayout from '../../layout/main';
import {DELETE_PART, GET_PARTS_LIST, GET_TOTAL_COUNT} from "./parts-gql";
import {Query} from 'react-apollo';
import PartDrawer from './parts-drawer';

import {withApollo} from "react-apollo";
import columnsTitleFormatter from "../../utils/table-columns-formatter";
import DeleteConfirmationModal from "../../components/modal/delete-confirmation-modal";
import useColumnFormatter from "../../hooks/table/use-column-formatter";

const {Search} = Input;

/**
 * @param props
 * @return {*}
 * @constructor
 */
const PartList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};

  const [mode, setMode] = useState('add');
  const [part, setPart] = useState({});

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

  // Methods
  const handleFormMode = part => {
    setMode('edit');
    setPart(part);
    showDrawerVisibility(true);
  };

  const showOrCancelConfirmModal = (visible, id) => {
    setToBeDeletedId(id);
    showConfirmVisibility(visible);
  };

  const cancelModal = () => {
    setMode('add');
    setPart({});
    showDrawerVisibility(false);
  };

  // todo: we can make this as custom hooks for deleting resource;
  const handleDelete = async () => {
    await props.client.mutate({
      mutation: DELETE_PART,
      variables: {
        id: toBeDeletedId
      },
      refetchQueries: [{query: GET_PARTS_LIST, variables: listOptions}]
    });

    showOrCancelConfirmModal(false, null);
    openNotificationWithIcon('success', 'Success', 'Driver has been deleted successfully');
  };

  // handles the paginate action of the table.
  const handlePaginate = (page) => {
    const offset = page * 15;
    setListOptions({...listOptions, offset});
  };

  const fields = ['name', 'code', 'quantity', 'description', 'created_at'];
  const columns = useColumnFormatter(fields, handleFormMode, showOrCancelConfirmModal);

  const refreshResult = () => {
    const paramValue = {_ilike: `%${searchText}%`};
    const where = {
      _or: [
        {name: paramValue},
        {code: paramValue},
      ]
    };
    setListOptions({...listOptions, ...{offset: 0, where}});
    handleTotalCount(where);
  };

  // Search
  const handleSearch = (text) => setSearchText(text);

  // Total Count
  const handleTotalCount = (where = null) => {
    const q = where != null ? {query: GET_TOTAL_COUNT, variables: {where}} : {query: GET_TOTAL_COUNT};

    props.client.query(q)
      .then(({data}) => setTotalCount(data.parts_aggregate.aggregate.count));
  };


  useEffect(() => refreshResult(), [searchText]);
  useEffect(() => handleTotalCount(), []);

  const drawerProps = {
    title: (mode === 'edit') ? 'Edit Part' : 'New Part',
    listOptions,
    part,
    mode,
    visible: drawerVisibility,
    onOk: () => showDrawerVisibility(false),
    onCancel: () => cancelModal()
  };

  const PartsList = (options) => (
    <Query query={GET_PARTS_LIST} variables={options} fetchPolicy="network-only">
      {({data, loading, error}) => {
        if (error) return `Error! )${error.message}`;
        return (
          <>
            <Table loading={loading}
                   pagination={{pageSize: 15, onChange: (page) => handlePaginate(page), total: totalCount}} rowKey="id"
                   dataSource={(!loading && data.parts) || []}
                   columns={columns}/>
          </>
        )
      }}
    </Query>
  );

  return (
    <MainLayout>
      <div className="page parts">
        <Row>
          <div className="right-content">
            <PageHeader title="Part">
              <div className="wrap">
                <div className="content">List of parts</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => showDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>Part</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            {PartsList(listOptions)}

            <DeleteConfirmationModal visible={confirmVisibility}
                                     onOk={() => handleDelete()}
                                     onCancel={() => showOrCancelConfirmModal(false, null)}/>


            <PartDrawer {...drawerProps}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(PartList);
