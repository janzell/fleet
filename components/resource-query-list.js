import {Query} from 'react-apollo';
import {Table} from 'antd';

const ResourceQueryList = ({columns, listOptions, query, totalCount, handlePaginate, resource}) => {
  return (
    <Query query={query} variables={listOptions} fetchPolicy="network-only">
      {({data, loading, error}) => {
        if (error) return `Error! ${error.message}`;
        return (
          <>
            <Table pagination={{pageSize: 15, onChange: (page) => handlePaginate(page), total: totalCount}}
                   rowKey="id"
                   expandedRowRender={record => <p style={{margin: 0}}><u>Notes:</u> {record.notes}</p>}
                   dataSource={(!loading && data[resource]) || []}
                   columns={columns}/>
          </>
        )
      }}
    </Query>
  )
};

export default ResourceQueryList;
