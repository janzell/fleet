import {Row, Breadcrumb, Icon, Table, PageHeader, Button, Divider} from 'antd';
import MainLayout from '../../layout/main';
import {getCookie, redirectNotAuthorized} from '../../lib/session';
import {GET_USER_LIST} from './part-gql';

const PartsList = props => {

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
    <MainLayout>
    <div className="page rentals!">
        <Row>
          <div className="right-content">
            <PageHeader onBack={() => null} title="Part's List" subTitle="List of parts"
                        extra={[<Button key="1" type="primary" href="part/add">Add New</Button>]}>
            </PageHeader>
            <Divider/>
            <Table dataSource={props.users} columns={columns}/>;
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

PartsList.getInitialProps = async function ({apolloClient, ...ctx}) {
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

  const users = [];

  return {users, userData, token};
};

export default PartsList;
