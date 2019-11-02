import {Query} from 'react-apollo';
import {Form, Select} from 'antd';
import {ALL_CASE_NUMBERS} from '../../queries/case-numbers-gql';
import {RequiredRule} from "../../lib/form-rules";

const CaseNumberList = (props) => {
  const {taxi} = props;
  const {getFieldDecorator} = props.form;

  return (
    <Query query={ALL_CASE_NUMBERS}>
      {({loading, error, data}) => {
        if (error) return 'error';
        if (loading) return 'loading';
        return (
          <Form.Item label="Case Number">
            {getFieldDecorator('case_number', {rules: [...RequiredRule], initialValue: taxi.case_number})(
              <Select showSearch={true}>
                {data.case_numbers.map((item, index) => (
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

export default CaseNumberList;
