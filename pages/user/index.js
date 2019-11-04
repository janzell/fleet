import {useState, useEffect} from 'react';
import {Row, Col, Icon, Input, PageHeader, Button} from 'antd';

import MainLayout from '../../layout/main';
import {GET_USERS_LIST, DELETE_USER, GET_TOTAL_COUNT} from "./../../queries/user-gql";

import UserDrawer from './user-drawer';

import {withApollo} from "react-apollo";
import DeleteConfirmationModal from "../../components/modal/delete-confirmation-modal";
import {useColumnFormatter} from "../../hooks/use-column-formatter";
import {successNotification} from "../../hooks/use-notification";
import ResourceQueryList from "../../components/resource-query-list";

const {Search} = Input;


const UserList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};


  const [mode, setMode] = useState('add');
  const [user, setUser] = useState({});

  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [confirmVisibility, setConfirmModalVisibility] = useState(false);

  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, handleSearch] = useState('');

  const handleFormMode = user => {
    setMode('edit');
    setUser(user);
    setDrawerVisibility(true);
  };

  const showOrCancelConfirmModal = (visible, user) => {
    setToBeDeletedId(user.id);
    setConfirmModalVisibility(visible);
  };

  const cancelDrawer = () => {
    setMode('add');
    setUser({});
    setDrawerVisibility(false);
  };

  const handleDelete = async () => {
    await props.client.mutate({
      mutation: DELETE_USER,
      variables: {
        id: toBeDeletedId
      },
      refetchQueries: [{query: GET_USERS_LIST, variables: listOptions}]
    });

    showOrCancelConfirmModal(false, toBeDeletedId);
    successNotification('User record has been deleted successfully');
  };

  const handlePaginate = page => setListOptions({...listOptions, ...{offset: page * 15}});

  const refreshResult = () => {
    const paramValue = {_ilike: `%${searchText}%`};
    const where = {
      _or: [
        {first_name: paramValue},
        {email: paramValue},
        {last_name: paramValue}
      ]
    };
    setListOptions({...listOptions, ...{offset: 0, where}});
    handleTotalCount(where);
  };

  // Total Count
  const handleTotalCount = (where = null) => {
    const q = where != null ? {query: GET_TOTAL_COUNT, variables: {where}} : {query: GET_TOTAL_COUNT};

    props.client.query(q)
      .then(({data}) => setTotalCount(data.users_aggregate.aggregate.count));
  };

  useEffect(() => refreshResult(), [searchText]);
  useEffect(() => handleTotalCount(), []);

  const drawerProps = {
    title: (mode === 'edit') ? 'Edit User' : 'New User',
    listOptions,
    user,
    mode,
    visible: drawerVisibility,
    onOk: () => setDrawerVisibility(false),
    onCancel: () => cancelDrawer()
  };


  const fields = ['first_name', 'last_name', 'email', 'created_at', 'updated_at'];
  const columns = useColumnFormatter(fields, handleFormMode, showOrCancelConfirmModal);

  return (
    <MainLayout>
      <div className="page users">
        <Row>
          <div className="right-content">
            <PageHeader title="User">
              <div className="wrap">
                <div className="content">List of users</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => setDrawerVisibility(true)} type="primary"><Icon
                    type="plus"/>User</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="search for first name, last name or email"
                          onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            <ResourceQueryList {...{
              columns,
              query: GET_USERS_LIST,
              listOptions,
              handlePaginate,
              totalCount,
              resource: 'users'
            }}/>

            <DeleteConfirmationModal visible={confirmVisibility}
                                     onOk={() => handleDelete()}
                                     onCancel={() => showOrCancelConfirmModal(false, null)}/>


            <UserDrawer {...drawerProps}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(UserList);
