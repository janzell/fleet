import {Row, Breadcrumb, Icon, Table, PageHeader} from 'antd';
import MainLayout from '../../layout/main';
import {getUsersList} from './drivers-gql';

const DriverList = props => {
  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
    {
      key: '3',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '4',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];


  return (
    <MainLayout users={props.users}>
      <div className="page drivers">
        <Row>
          <div className="right-content">
            <PageHeader onBack={() => null} title="Driver's List" subTitle="List of drivers"/>,
            <Table dataSource={dataSource} columns={columns}/>;
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

DriverList.getInitialProps = async function ({apolloClient, ...ctx}) {
  // Authenticate first?

  // Get user data from cookie
  // const userData = JSON.parse(decodeURIComponent(getCookie('userData', ctx.req)));

  // Get business details
  // const users = await apolloClient.query({
  //   query: getUsersList,
  //   fetchPolicy: "network-only",
  //   variables: {}
  // });
  //
  // return {users};

  return  {users: []}
};

export default DriverList;
