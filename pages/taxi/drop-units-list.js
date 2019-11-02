import {Query} from 'react-apollo';
import {useState} from 'react';
import {Table} from 'antd';

import {GET_TAXIS_LIST} from "../../queries/taxi-gql";

const DropUnitList = (props) => {

  const [listOptions, setListOptions] = useState();
  const [totalCount, setTotalCount] = useState(0);

  const columns = {};


  function handlePaginate(page) {
  }

  return (
    <Query query={GET_TAXIS_LIST} variables={listOptions} fetchPolicy="network-only">
    {({data, loading, error}) => {
      if (error) return `Error! ${error.message}`;
      return (
        <>
          <Table pagination={{pageSize: 15, onChange: (page) => handlePaginate(page), total: totalCount}}
                 rowKey="id"
                 expandedRowRender={record => <p style={{margin: 0}}><u>Notes:</u> {record.notes}</p>}
                 dataSource={(!loading && data.taxis) || []}
                 columns={columns}/>
        </>
      )
    }}
  </Query>
  )
};

export default DropUnitList;
