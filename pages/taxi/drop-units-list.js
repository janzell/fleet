import {Query} from 'react-apollo';
import {useState} from 'react';
import {Table} from 'antd';

import {GET_DROP_UNITS_LIST} from "../../queries/drop-units-gql";
import {titlesFormatter} from '../../hooks/use-column-formatter';

const DropUnitList = (props) => {

  const {taxi} = props;

  const listOptionsDefault = {limit: 5, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};


  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [totalCount, setTotalCount] = useState(0);

  const columns = titlesFormatter([
    'body_number',
    'case_number',
    'plate_number',
    'acquired_at',
    'engine_number',
    'year_model',
    'series.name',
    'notes'
  ]);


  console.log(columns);

  function handlePaginate(page) {

  }

  return (
    <Query query={GET_DROP_UNITS_LIST} variables={listOptions} fetchPolicy="network-only">
      {({data, loading, error}) => {
        if (error) return `Error! ${error.message}`;
        return (
          <>
            <Table pagination={{pageSize: 15, onChange: (page) => handlePaginate(page), total: totalCount}}
                   rowKey="id"
                   dataSource={(!loading && data.drop_units) || []}
                   columns={columns}/>
          </>
        )
      }}
    </Query>
  )
};

export default DropUnitList;
