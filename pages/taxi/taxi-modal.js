import {Form, Input, InputNumber, Select, Slider, Row, Col, Modal} from 'antd';
import {RequiredRule} from '../../lib/form-rules';
import {ADD_TAXI, UPDATE_TAXI} from "./taxi-gql";
import {withApollo} from "react-apollo";
import {useEffect, useState} from "react";

const {TextArea} = Input;
const {Option} = Select;

const TaxiModal = props => {

  const {taxi} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  // States
  const [oilPercentage, setOilPercentage] = useState(0);
  const [status, setStatus] = useState('operable');

  // todo: useCustom hooks?
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

  useEffect(() => {
    if (!props.visible) resetFields();
  }, [props.visible]);

  return (
    <Modal
      title="New Taxi"
      centered
      okText="Save"
      width={800}
      visible={props.visible}
      onOk={handleSave}
      onCancel={props.onCancel}>
      <Form className="ant-advanced-search-form" onSubmit={handleSave}>
        <Row gutter={6}>
          <Col lg={8}>
            <Form.Item label="Brand">
              {getFieldDecorator('brand', {rules: RequiredRule, initialValue: taxi.brand})(
                <Input placeholder="Brand"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item label="Model">
              {getFieldDecorator('model', {rules: RequiredRule, initialValue: taxi.model})(
                <Input placeholder="Model"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item label="Plate Number">
              {getFieldDecorator('plate_number', {rules: RequiredRule, initialValue: taxi.plate_number})(
                <Input placeholder="Plate  Number"/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col lg={8}>
            <Form.Item label="Color">
              {getFieldDecorator('color', {rules: RequiredRule, initialValue: taxi.color})(
                <Input placeholder="Color"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={16}>
            <Form.Item label="Oil Percentage">
              <Col lg={12}>
                <Slider
                  min={1}
                  max={100}
                  onChange={setOilPercentage}
                  value={typeof oilPercentage === 'number' ? oilPercentage : 0}
                />
              </Col>
              <Col lg={12}>
                <InputNumber
                  min={1}
                  max={20}
                  style={{marginLeft: 16}}
                  value={oilPercentage}
                  onChange={setOilPercentage}
                />
                &nbsp;%
              </Col>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col lg={8}>
            <Form.Item label="Status">
              <Select defaultValue="operable" style={{width: 120}} onChange={setStatus}>
                <Option value="operable">Operable</Option>
                <Option value="maintenance">Maintenance</Option>
                <Option value="jack">Jack (100)</Option>
                <Option value="lucy">Lucy (101)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item label="Mileage">
              {getFieldDecorator('mileage', {initialValue: taxi.mileage})(
                <InputNumber placeholder="Mileage"/>
              )}
            </Form.Item>
          </Col>

          <Col lg={8}>
            <Form.Item label="Planned Maintenance">
              {getFieldDecorator('planned_maintenance', {initialValue: taxi.planned_maintenance})(
                <InputNumber placeholder="Planned Maintenance"/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={12}>
            <Form.Item label="Malfunctions">
              {getFieldDecorator('malfunctions', {initialValue: taxi.malfunctions})(
                <TextArea placeholder="Malfunctions"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={12}>
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
