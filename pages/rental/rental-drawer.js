import {Form, Input, Row, Col, Modal} from 'antd';
import {RequiredRule} from '../../lib/form-rules';
import {ADD_DRIVER, UPDATE_DRIVER} from "./rental-gql";
import {withApollo} from "react-apollo";

const {TextArea} = Input;

const RentalDrawer = props => {

  // Destructor
  const {driver} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  const handleSave = (e) => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        (driver.id) ? updateDriver(driver.id, values) : storeDriver(values);

        resetFields();
        props.onCancel();
      }
    });

  };

  const updateDriver = async (id, data) => {
    await props.client.mutate({
      mutation: UPDATE_DRIVER,
      variables: {
        id,
        driver: data
      }
    });
  };

  const storeDriver = async data => {
    await props.client.mutate({
      mutation: ADD_DRIVER,
      variables: {
        driver: data
      }
    });
  };

  return (
    <Modal
      title="New Driver"
      centered
      okText="Save"
      visible={props.visible}
      onOk={handleSave}
      onCancel={props.onCancel}
    > <Form className="ant-advanced-search-form" onSubmit={handleSave}>
      <Row gutter={12}>
        <Col lg={24}>
          <Form.Item label="First Name">
            {/*{getFieldDecorator('first_name', {rules: RequiredRule, initialValue: driver.first_name})(*/}
            {/*  <Input placeholder="First Name"/>*/}
            {/*)}*/}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col lg={24}>
          <Form.Item label="Last Name">
            {/*{getFieldDecorator('last_name', {rules: RequiredRule, initialValue: driver.last_name})(*/}
            {/*  <Input placeholder="Last Name"/>*/}
            {/*)}*/}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col lg={24}>
          <Form.Item label="License Number">
            {/*{getFieldDecorator('license_number', {rules: RequiredRule, initialValue: driver.license_number})(*/}
            {/*  <Input placeholder="License Number"/>*/}
            {/*)}*/}
          </Form.Item>
        </Col>
        <Col lg={24}>
          <Form.Item label="Address">
            {/*{getFieldDecorator('address', {rules: RequiredRule, initialValue: driver.address})(*/}
            {/*  <TextArea placeholder="Address"/>*/}
            {/*)}*/}
          </Form.Item>
        </Col>
      </Row>
    </Form>
    </Modal>
  )
};

export default withApollo(Form.create()(RentalDrawer));
