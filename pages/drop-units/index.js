import {useEffect, useState} from 'react';
import {Row, Col, Input, PageHeader} from 'antd';

import MainLayout from '../../layout/main';
import {withApollo} from "react-apollo";

import {GET_DROP_UNITS_LIST, GET_TOTAL_COUNT} from "./../../queries/drop-units-gql";

import {useColumnFormatter} from "../../hooks/use-column-formatter";
import ResourceQueryList from "../../components/resource-query-list";

const {Search} = Input;

const BodyNumberList = props => {

  const listOptionsDefault = {limit: 15, offset: 0, order_by: [{updated_at: 'desc'}, {created_at: 'desc'}]};
  const fields = ['body_number', 'plate_number', 'acquired_at', 'notes', 'created_at', 'updated_at'];

  const [totalCount, setTotalCount] = useState(0);
  const [listOptions, setListOptions] = useState(listOptionsDefault);
  const [searchText, setSearchText] = useState('');


  // Paginate
  const handlePaginate = (page) => {
    const offset = page * 15;
    setListOptions({...listOptions, offset});
  };


  const refreshResult = () => {
    const paramValue = {_ilike: `%${searchText}%`};
    const where = {
      _or: [
        {body_number: paramValue},
      ]
    };
    setListOptions({...listOptions, ...{offset: 0, where}});
    handleTotalCount(where);
  };

  // Search
  const handleSearch = text => setSearchText(text);

  // Fields
  const columns = useColumnFormatter(fields, null, null);

  // Count
  const handleTotalCount = (where = null) => {
    const q = where != null ? {query: GET_TOTAL_COUNT, variables: {where}} : {query: GET_TOTAL_COUNT};

    props.client.query(q)
      .then(({data}) => setTotalCount(data.drop_units_aggregate.aggregate.count));
  };

  // Effects
  useEffect(() => refreshResult(), [searchText]);
  useEffect(() => handleTotalCount(), []);

  return (
    <MainLayout>
      <div className="page drop-units">
        <Row>
          <div className="right-content">
            <PageHeader title="Drop Units">
              <div className="wrap">
                <div className="content">List of drop units</div>
              </div>
              <Row className="mt-20">
                <Col offset={16} span={8}>
                  <Search placeholder="input search text" onSearch={value => handleSearch(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            <ResourceQueryList {...{
              columns,
              query: GET_DROP_UNITS_LIST,
              listOptions,
              handlePaginate,
              totalCount,
              resource: 'drop_units'
            }}/>

          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(BodyNumberList);
