import {Query} from 'react-apollo';
import {Form, Select} from 'antd';
import {ALL_COMPANIES} from '../../queries/company-gql';

const CompanyList = (props) => {
  const {taxi} = props;
  const {getFieldDecorator} = props.form;

  return (
    <Query query={ALL_COMPANIES}>
      {({loading, error, data}) => {
        if (error) return 'error';
        if (loading) return 'loading';
        return (
          <Form.Item label="Company">
            {getFieldDecorator('company_id', {rules: [{required: true}], initialValue: taxi.company_id})(
              <Select showSearch={true}>
                {data.companies.map((item, index) => (
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

export default CompanyList;
