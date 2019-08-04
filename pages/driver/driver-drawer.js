import {Form, Input, Button, Row, Col, notification, Drawer} from 'antd';
import {RequiredRule} from '../../lib/form-rules';
import {ADD_DRIVER, GET_DRIVERS_LIST, UPDATE_DRIVER} from "./drivers-gql";
import {withApollo} from "react-apollo";
import {useEffect} from "react";

const {TextArea} = Input;

const DriverDrawer = props => {
  const {driver, listOptions} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  // todo: make this shit as a custom hooks.
  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message,
      description
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isEditMode = (driver.id);
        const action = isEditMode ? 'Updated' : 'Added';

        // Append updated_at every time we update on something.
        values.updated_at = new Date();

        isEditMode
          ? mutateDriver(UPDATE_DRIVER, {id: driver.id, driver: values})
          : mutateDriver(ADD_DRIVER, {driver: values});

        openNotificationWithIcon('success', 'Success', `Driver ${action} successfully`);
        resetFields();
        props.onCancel();
      }
    });
  };

  const mutateDriver = async (mutation, variables) => {
    await props.client.mutate({
      mutation,
      variables,
      refetchQueries: [{query: GET_DRIVERS_LIST, variables: listOptions}]
    });
  };

  useEffect(() => {
    // Reset the form fields when there's a change on the visible props.
    if (!props.visible) resetFields();
  }, [props.visible]);

  return (
    <Drawer
      width={600}
      title={props.title}
      placement="right"
      closable={false}
      onClose={props.onCancel}
      visible={props.visible}>
      <Form className="ant-advanced-search-form" onSubmit={handleSave}>
        <Row gutter={24}>
          <Col lg={12}>
            <Form.Item label="First Name">
              {getFieldDecorator('first_name', {rules: RequiredRule, initialValue: driver.first_name})(
                <Input placeholder="First Name"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item label="Last Name">
              {getFieldDecorator('last_name', {rules: RequiredRule, initialValue: driver.last_name})(
                <Input placeholder="Last Name"/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={12}>
            <Form.Item label="License Number">
              {getFieldDecorator('license_number', {rules: RequiredRule, initialValue: driver.license_number})(
                <Input placeholder="License Number"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item label="Contact Number">
              {getFieldDecorator('contact_number', {rules: RequiredRule, initialValue: driver.contact_number})(
                <Input placeholder="Contact Number"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={24}>
            <Form.Item label="Address">
              {getFieldDecorator('address', {rules: RequiredRule, initialValue: driver.address})(
                <TextArea placeholder="Address"/>
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

export default withApollo(Form.create()(DriverDrawer));
