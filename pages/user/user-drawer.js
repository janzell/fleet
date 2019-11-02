import {useEffect} from 'react';
import {withApollo} from "react-apollo";
import moment from 'moment';
import {Form, Button, Input, Row, Col, Drawer} from 'antd';

import {RequiredRule} from '../../lib/form-rules';
import {GET_USERS_LIST, UPDATE_USER, ADD_USER} from "./../../queries/user-gql";

import {errorNotification, successNotification} from "../../hooks/use-notification";


const UserDrawer = props => {

  const {client, user, listOptions, title, onCancel, visible} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  const handleSave = (e) => {
    e.preventDefault();

    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isEditMode = (user.id);
        const action = isEditMode ? 'updated' : 'added';

        values.updated_at = moment().format('YYYY-MM-D HH:mm:ss');

        const result = isEditMode
          ? mutateUser(UPDATE_USER, {id: user.id, user: values})
          : mutateUser(ADD_USER, {user: values});

        result.then(() => {
          successNotification(`User was successfully ${action}.`);
          resetFields();
          onCancel();
        }).catch(err => {
          errorNotification(`User ${action} failed. Reason: ${err.message}`);
        });
      }
    });
  };

  const mutateUser = async (mutation, variables) => {
    return await client.mutate({
      mutation,
      variables,
      refetchQueries: [{query: GET_USERS_LIST, variables: listOptions}]
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
          <Col lg={12}>
            <Form.Item label="First Name">
              {getFieldDecorator('first_name', {rules: RequiredRule, initialValue: user.first_name})(
                <Input placeholder="First Name"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item label="Last Name">
              {getFieldDecorator('last_name', {rules: RequiredRule, initialValue: user.last_name})(
                <Input placeholder="Last Name"/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={12}>
            <Form.Item label="Email">
              {getFieldDecorator('email', {rules: RequiredRule, initialValue: user.email})(
                <Input placeholder="Email"/>
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

export default withApollo(Form.create()(UserDrawer));
