import {Form, Input, Row, Button, Col, Drawer} from 'antd';

import {RequiredRule} from '../../lib/form-rules';
import {ADD_PART, UPDATE_PART, GET_PARTS_LIST} from "./../../queries/parts-gql";

import {withApollo} from "react-apollo";

import {errorNotification, successNotification} from "../../hooks/use-notification";

const {TextArea} = Input;

const PartsDrawer = props => {
  const {part, listOptions, onCancel} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  const handleSave = (e) => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isEditMode = (part.id);
        const action = isEditMode ? 'Updated' : 'Added';

        const result = isEditMode
          ? mutatePart(UPDATE_PART, {id: part.id, driver: values})
          : mutatePart(ADD_PART, {part: values});

        result.then(() => {
          successNotification(`Parts was successfully ${action}.`);
          resetFields();
          onCancel();
        }).catch(err => {
          errorNotification(`Parts ${action} failed. Reason: ${err.message}`);
        });
      }
    });
  };

  const mutatePart = async (mutation, variables) => {
    return await props.client.mutate({
      mutation,
      variables,
      refetchQueries: [{query: GET_PARTS_LIST, variables: listOptions}]
    });
  };

  return (
    <Drawer
      width={600}
      title={props.title}
      placement="right"
      closable={false}
      onClose={props.onCancel}
      visible={props.visible}
    > <Form className="ant-advanced-search-form" onSubmit={handleSave}>
      <Row gutter={12}>
        <Col lg={24}>
          <Form.Item label="Name">
            {getFieldDecorator('name', {rules: RequiredRule, initialValue: part.name})(
              <Input placeholder="Name"/>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col lg={24}>
          <Form.Item label="Code">
            {getFieldDecorator('code', {rules: RequiredRule, initialValue: part.code})(
              <Input placeholder="Code"/>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col lg={24}>
          <Form.Item label="Quantity">
            {getFieldDecorator('quantity', {rules: RequiredRule, initialValue: part.quantity})(
              <Input placeholder="Quantity"/>
            )}
          </Form.Item>
        </Col>
        <Col lg={24}>
          <Form.Item label="Description">
            {getFieldDecorator('description', {rules: RequiredRule, initialValue: part.description})(
              <TextArea placeholder="Description"/>
            )}
          </Form.Item>
        </Col>
      </Row>

      <div className="button-container">
        <Button onClick={props.onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSave}>Save</Button>
      </div>

    </Form>
    </Drawer>
  )
};

export default withApollo(Form.create()(PartsDrawer));
