import {Query} from 'react-apollo';
import {Form, Select} from 'antd';
import {ALL_BODY_NUMBERS} from '../../queries/body-numbers-gql';
import {RequiredRule} from "../../lib/form-rules";

const BodyNumberList = (props) => {
  const {taxi} = props;
  const {getFieldDecorator} = props.form;

  return (
    <Query query={ALL_BODY_NUMBERS}>
      {({loading, error, data}) => {
        if (error) return 'error';
        if (loading) return 'loading';
        return (
          <Form.Item label="Body Number">
            {getFieldDecorator('body_number', {rules: [...RequiredRule], initialValue: taxi.body_number})(
              <Select showSearch={true}>
                {data.body_numbers.map((item, index) => (
                  <Option key={index} value={item.number}>{item.number}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
        )
      }}
    </Query>
  )
};

export default BodyNumberList;
