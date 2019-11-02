import {withApollo} from "react-apollo";
import {useEffect} from "react";
import moment from 'moment';

import {Form, Input, Button, Row, Col, Drawer} from 'antd';

import {RequiredRule} from '../../lib/form-rules';
import {ADD_BODY_NUMBER, GET_BODY_NUMBER_LIST, UPDATE_BODY_NUMBER} from "./../../queries/body-numbers-gql";

import {errorNotification, successNotification} from '../../hooks/use-notification';

const {TextArea} = Input;

const BodyNumberDrawer = props => {
  const {client, bodyNumber, listOptions, title, onCancel, visible} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  const handleSave = (e) => {
    e.preventDefault();

    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isEditMode = (bodyNumber.number);
        const action = isEditMode ? 'updated' : 'added';

        values.updated_at = moment().format('YYYY-MM-D HH:mm:ss');

        const result = isEditMode
          ? mutateBodyNumber(UPDATE_BODY_NUMBER, {number: bodyNumber.number, body_numbers: values})
          : mutateBodyNumber(ADD_BODY_NUMBER, {body_numbers: values});

        result.then(() => {
          successNotification(`Body number was successfully ${action}.`);
          resetFields();
          onCancel();
        }).catch(err => {
          errorNotification(`Body number ${action} failed. Reason: ${err.message}`);
        });
      }
    });
  };

  const mutateBodyNumber = async (mutation, variables) => {
    return await client.mutate({
      mutation,
      variables,
      refetchQueries: [{query: GET_BODY_NUMBER_LIST, variables: listOptions}]
    });
  };

  useEffect(() => {
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
            <Form.Item label="Number">
              {getFieldDecorator('number', {rules: RequiredRule, initialValue: bodyNumber.number})(
                <Input placeholder="Number"/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={24}>
            <Form.Item label="Notes">
              {getFieldDecorator('notes', {initialValue: bodyNumber.notes})(
                <TextArea placeholder="Notes"/>
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

export default withApollo(Form.create()(BodyNumberDrawer));
