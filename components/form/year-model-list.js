import {Query} from 'react-apollo';
import {Form, Select} from 'antd';
import {ALL_YEAR_MODELS} from '../../queries/year-model-gql';
import {RequiredRule} from "../../lib/form-rules";

const YearModelList = (props) => {
  const {taxi} = props;
  const {getFieldDecorator} = props.form;

  return (
    <Query query={ALL_YEAR_MODELS}>
      {({loading, error, data}) => {
        if (error) return 'error';
        if (loading) return 'loading';
        return (
          <Form.Item label="Year Model">
            {getFieldDecorator('year_model', {rules: [...RequiredRule], initialValue: taxi.year_model})(
              <Select showSearch={true}>
                {data.year_models.map((item, index) => (
                  <Option key={index} value={item.name}>{item.name}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
        )
      }}
    </Query>
  )
};

export default YearModelList;
