import {Query} from 'react-apollo';
import {Form, Select} from 'antd';
import {ALL_SERIES} from '../../queries/series-gql';

const SeriesList = (props) => {
  const {taxi} = props;
  const {getFieldDecorator} = props.form;

  return (
    <Query query={ALL_SERIES}>
      {({loading, error, data}) => {
        if (error) return 'error';
        if (loading) return 'loading';
        return (
          <Form.Item label="Series">
            {getFieldDecorator('series_id', {rules: [{required: true}], initialValue: taxi.series_id})(
              <Select showSearch={true}>
                {data.series.map((item, index) => (
                  <Option key={index} value={item.id}>{item.name}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
        )
      }}
    </Query>
  )
};

export default SeriesList;
