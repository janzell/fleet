import {Row, Button, Divider, Table, PageHeader} from 'antd';
import MainLayout from '../../layout/main';
import {getCookie, redirectNotAuthorized} from '../../lib/session';
import {GET_USER_LIST} from './users-gql';


const UserList = props => {
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    },

    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
        <a href="javascript:;">Edit {record.name}</a>
        <Divider type="vertical"/>
        <a href="javascript:;">Delete</a>
      </span>
      ),
    },
  ];


  return (
    <MainLayout>
      <div className="page user">
        <Row>
          <div className="right-content">
            <PageHeader onBack={() => null} title="User's List" subTitle="List of users"
                        extra={[<Button key="1" type="primary" href="/user/add">Add New</Button>]}>
            </PageHeader>
            <Divider/>
            <Table dataSource={props.users} columns={columns}/>;
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

UserList.getInitialProps = async function ({apolloClient, ...ctx}) {
  // redirectNotAuthorized(ctx);

  const token = getCookie('token', ctx.req);
  const userData = JSON.parse(decodeURIComponent(getCookie('userData', ctx.req)));

  const {data} = await apolloClient.query({
    query: GET_USER_LIST,
    fetchPolicy: "network-only",
    variables: {
      limit: 25, offset: 0
    }
  });

  return {users: data.users, userData, token};
};

export default UserList;
