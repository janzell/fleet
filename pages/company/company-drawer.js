import moment from 'moment';
import {withApollo} from "react-apollo";
import {useEffect} from "react";

import {Form, Input, Button, Row, Col, Drawer} from 'antd';

import {RequiredRule} from '../../lib/form-rules';
import {ADD_COMPANY, GET_COMPANIES_LIST, UPDATE_COMPANY} from "./company-gql";
import {errorNotification, successNotification} from "../../hooks/use-notification";

const {TextArea} = Input;

const CompanyDrawer = props => {
  const {client, company, listOptions, title, onCancel, visible} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  const handleSave = (e) => {
    e.preventDefault();

    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isEditMode = (company.id);
        const action = isEditMode ? 'Updated' : 'Added';

        values.updated_at = moment().format('YYYY-MM-D HH:mm:ss');

        const result = isEditMode
          ? mutateCompany(UPDATE_COMPANY, {id: company.id, company: values})
          : mutateCompany(ADD_COMPANY, {company: values});

        result.then(() => {
          successNotification(`Company was successfully ${action}.`);
          resetFields();
          onCancel();
        }).catch(err => {
          errorNotification(`Company ${action} failed. Reason: ${err.message}`);
        });
      }
    });
  };

  const mutateCompany = async (mutation, variables) => {
    return await client.mutate({
      mutation,
      variables,
      refetchQueries: [{query: GET_COMPANIES_LIST, variables: listOptions}]
    });
  };

  useEffect(() => {
    // Reset the form fields when there's a change on the visible props.
    if (!visible) resetFields();
  }, [visible]);

  return (
    <Drawer
      width={600}
      title={title}
      placement="right"
      closable={false}
      onClose={onCancel}
      visible={visible}>
      <Form className="ant-advanced-search-form" onSubmit={handleSave}>
        <Row gutter={12}>
          <Col>
            <Form.Item label="Name">
              {getFieldDecorator('name', {rules: RequiredRule, initialValue: company.name})(
                <Input placeholder="Name"/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={24}>
            <Form.Item label="Address">
              {getFieldDecorator('address', {rules: RequiredRule, initialValue: company.address})(
                <TextArea placeholder="Address"/>
              )}
            </Form.Item>
          </Col>
        </Row>

        <div className="button-container">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>Save</Button>
        </div>
      </Form>
    </Drawer>
  )
};

export default withApollo(Form.create()(CompanyDrawer));
