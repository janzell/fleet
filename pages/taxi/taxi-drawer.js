import {Form, Input, InputNumber, Select, Slider, Row, Col, Drawer, Button, notification} from 'antd';

import {withApollo} from "react-apollo";
import {useEffect, useState} from "react";
import TaxiPhotoUpload from './taxi-photo-upload';

import {RequiredRule} from '../../lib/form-rules';
import {ADD_TAXI, GET_TAXIS_LIST, UPDATE_TAXI} from "./taxi-gql";
import {ADD_DRIVER, GET_DRIVERS_LIST, UPDATE_DRIVER} from "../driver/drivers-gql";

const {TextArea} = Input;
const {Option} = Select;

const TaxiModal = props => {

  const {client, taxi, onCancel, title, visible, listOptions} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  // States
  const [oilPercentage, setOilPercentage] = useState(0);
  const [status, setStatus] = useState('operable');

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({message, description});
  };

  // todo: useCustom hooks?
  const handleSave = (e) => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        const isEditMode = (taxi.id);
        const action = isEditMode ? 'Updated' : 'Added';

        isEditMode
          ? mutateTaxi(UPDATE_TAXI, {id: taxi.id, taxi: values})
          : mutateTaxi(ADD_TAXI, {taxi: values});

        openNotificationWithIcon('success', 'Success', `Taxi ${action} successfully`);
        resetFields();
        onCancel();
      }
    });
  };

  const mutateTaxi = async (mutation, variables) => {
    await client.mutate({mutation, variables, refetchQueries: [{query: GET_TAXIS_LIST, variables: listOptions}]});
  };

  useEffect(() => {
    if (!visible) resetFields();
  }, [visible]);

  return (
    <Drawer
      width={800}
      title={title}
      placement="right"
      closable={false}
      onClose={onCancel}
      visible={visible}>
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
              {getFieldDecorator('model', {rules: [...RequiredRule, ...[{type: 'number'}]], initialValue: taxi.model})(
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
        <Row>
          <Col lg={12}>
            <TaxiPhotoUpload/>
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

export default withApollo(Form.create()(TaxiModal));
