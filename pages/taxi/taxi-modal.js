import {Form, Input, Row, Col, Modal} from 'antd';
import {RequiredRule} from '../../lib/form-rules';
import {ADD_TAXI, UPDATE_TAXI} from "./taxi-gql";
import {withApollo} from "react-apollo";

const {TextArea} = Input;

/**
 * Taxi Modal.
 *
 * @param props
 * @return {*}
 * @constructor
 */
const TaxiModal = props => {

  const {taxi} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  const handleSave = (e) => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        (taxi.id) ? updateTaxi(taxi.id, values) : storeTaxi(values);

        resetFields();
        props.onCancel();
      }
    });

  };

  const updateTaxi = async (id, data) => {
    await props.client.mutate({
      mutation: UPDATE_TAXI,
      variables: {
        id,
        taxi: data
      }
    });
  };

  const storeTaxi = async data => {
    await props.client.mutate({
      mutation: ADD_TAXI,
      variables: {
        taxi: data
      }
    });
  };

  return (
    <Modal
      title="New Taxi"
      centered
      okText="Save"
      visible={props.visible}
      onOk={handleSave}
      onCancel={props.onCancel}
    > <Form className="ant-advanced-search-form" onSubmit={handleSave}>
      <Row gutter={12}>
        <Col lg={24}>
          <Form.Item label="Plate Number">
            {getFieldDecorator('plate_number', {rules: RequiredRule, initialValue: taxi.plate_number})(
              <Input placeholder="Plate  Number"/>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col lg={24}>
          <Form.Item label="Color">
            {getFieldDecorator('color', {rules: RequiredRule, initialValue: taxi.color})(
              <Input placeholder="Color"/>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col lg={24}>
          <Form.Item label="Notes">
            {getFieldDecorator('notes', {initialValue: taxi.notes})(
              <TextArea placeholder="Notes"/>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
    </Modal>
  )
};

export default withApollo(Form.create()(TaxiModal));
