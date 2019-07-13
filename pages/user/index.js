import {Row, Breadcrumb, Icon, Divider, Table, PageHeader} from 'antd';
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
            <PageHeader onBack={() => null} title="User's List" subTitle="List of users"/>,
            <Table dataSource={props.users} columns={columns}/>;
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

UserList.getInitialProps = async function ({apolloClient, ...ctx}) {
  // redirectNotAuthorized(ctx);

  // Authenticate first
  // Get user data from cookie
  console.log(ctx);
  console.log(getCookie('userData', ctx.req));
  const token = getCookie('token', ctx.req);
  const userData = JSON.parse(decodeURIComponent(getCookie('userData', ctx.req)));

  // // Get business details
  // const users = await apolloClient.query({
  //   query: GET_USER_LIST,
  //   fetchPolicy: "network-only",
  //   variables: {}
  // });

  const users = [
    {
      key: '1',
      first_name: 'Mike',
      last_name: 'Mike',
      email: '10 Downing Street',
    },
    {
      key: '2',
      first_name: 'Mike',
      last_name: 'Mike',
      email: '10 Downing Street',
    },
    {
      key: '3',
      first_name: 'Mike',
      last_name: 'Mike',
      email: '10 Downing Street',
    },
    {
      key: '4',
      first_name: 'Mike',
      last_name: 'Mike',
      email: '10 Downing Street',
    },
  ];

  return {users, userData, token};
};

export default UserList;
