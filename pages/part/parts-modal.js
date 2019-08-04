import {Form, Input, Row, Col, Modal} from 'antd';
import {RequiredRule} from '../../lib/form-rules';
import {ADD_PART, UPDATE_PART} from "./parts-gql";
import {withApollo} from "react-apollo";

const {TextArea} = Input;

const PartsModal = props => {
  const {part} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  const handleSave = (e) => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        (part.id) ? updatePart(part.id, values) : storePart(values);

        resetFields();
        props.onCancel();
      }
    });

  };

  const updatePart = async (id, data) => {
    await props.client.mutate({
      mutation: UPDATE_PART,
      variables: {
        id,
        part: data
      }
    });
  };

  const storePart = async data => {
    await props.client.mutate({
      mutation: ADD_PART,
      variables: {
        part: data
      }
    });
  };

  return (
    <Modal
      title="New"
      centered
      okText="Save"
      visible={props.visible}
      onOk={handleSave}
      onCancel={props.onCancel}
    > <Form className="ant-advanced-search-form" onSubmit={handleSave}>
      <Row gutter={12}>
        <Col lg={24}>
          <Form.Item label="First Name">
            {getFieldDecorator('first_name', {rules: RequiredRule, initialValue: part.first_name})(
              <Input placeholder="First Name"/>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col lg={24}>
          <Form.Item label="Last Name">
            {getFieldDecorator('last_name', {rules: RequiredRule, initialValue: part.last_name})(
              <Input placeholder="Last Name"/>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col lg={24}>
          <Form.Item label="License Number">
            {getFieldDecorator('license_number', {rules: RequiredRule, initialValue: part.license_number})(
              <Input placeholder="License Number"/>
            )}
          </Form.Item>
        </Col>
        <Col lg={24}>
          <Form.Item label="Address">
            {getFieldDecorator('address', {rules: RequiredRule, initialValue: part.address})(
              <TextArea placeholder="Address"/>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
    </Modal>
  )
};

export default withApollo(Form.create()(PartsModal));
