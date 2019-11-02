import {withApollo} from "react-apollo";
import {useEffect} from "react";
import moment from 'moment';

import {Form, Input, Button, Row, Col, Drawer} from 'antd';

import {RequiredRule} from '../../lib/form-rules';
import {ADD_GARAGE, GET_GARAGE_LIST, UPDATE_GARAGE} from "./../../queries/garage-gql";

import {errorNotification, successNotification} from "../../hooks/use-notification";

const {TextArea} = Input;

const GarageDrawer = props => {
  const {client, garage, listOptions, title, onCancel, visible} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  const handleSave = (e) => {
    e.preventDefault();

    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isEditMode = (garage.number);
        const action = isEditMode ? 'updated' : 'added';

        values.updated_at = moment().format('YYYY-MM-D HH:mm:ss');

        const result = isEditMode
          ? mutateGarage(UPDATE_GARAGE, {number: garage.number, garages: values})
          : mutateGarage(ADD_GARAGE, {garages: values});

        result.then(() => {
          successNotification(`Garage was successfully ${action}.`);
          resetFields();
          onCancel();
        }).catch(err => {
          errorNotification(`Garage ${action} failed. Reason: ${err.message}`);
        });
      }
    });
  };

  const mutateGarage = async (mutation, variables) => {
    return await client.mutate({
      mutation,
      variables,
      refetchQueries: [{query: GET_GARAGE_LIST, variables: listOptions}]
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
              {getFieldDecorator('name', {rules: RequiredRule, initialValue: garage.name})(
                <Input placeholder="Name"/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={24}>
            <Form.Item label="Address">
              {getFieldDecorator('address', {initialValue: garage.address})(
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

export default withApollo(Form.create()(GarageDrawer));
