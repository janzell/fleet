import {Query} from 'react-apollo';
import {Form, Select} from 'antd';
import {ALL_GARAGE} from '../../queries/garage-gql';

const GarageList = (props) => {
  const {taxi} = props;
  const {getFieldDecorator} = props.form;

  return (
    <Query query={ALL_GARAGE}>
      {({loading, error, data}) => {
        if (error) return 'error';
        if (loading) return 'loading';
        return (
          <Form.Item label="Garage">
            {getFieldDecorator('garage_id', {rules: [{required: true}], initialValue: taxi.garage_id})(
              <Select showSearch={true}>
                {data.garages.map((item, index) => (
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
export default GarageList;
