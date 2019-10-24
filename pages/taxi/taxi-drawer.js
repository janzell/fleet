import moment from 'moment';
import {Form, Input, Select, DatePicker, Row, Col, Drawer, Button, notification} from 'antd';

import {withApollo, Query} from "react-apollo";
import {useEffect, useState} from "react";

import {RequiredRule} from '../../lib/form-rules';
import {ADD_TAXI, GET_TAXIS_LIST, UPDATE_TAXI} from "./taxi-gql";
import {ALL_BODY_NUMBERS} from './../body-number/body-numbers-gql'

const {TextArea} = Input;
const {Option} = Select;

const TaxiDrawer = props => {

  const {client, taxi, onCancel, title, visible, listOptions} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  // States
  const [status, setStatus] = useState('operable');
  const [crIssueAt, setCrIssuedAt] = useState();
  const [orIssueAt, setOrIssuedAt] = useState();
  const [acquiredAt, setAcquiredAt] = useState();
  const [bodyNumber, onBodyNumberSelected] = useState();

  const dateFormat = 'YYYY/MM/DD';

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({message, description});
  };

  // todo: useCustom hooks?
  const handleSave = (e) => {
    e.preventDefault();

    validateFieldsAndScroll((err, values) => {
      if (!err) {
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

  // todo: transfer this.
  const BodyNumberList = (defaultValue) => {
    return (
    <Query query={ALL_BODY_NUMBERS}>
      {({loading, error, data}) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
  
        return (
          <Select showSearch={true} name="body_number" defaultValue={defaultValue}>
            {data.body_numbers.map( (item, index) => (
              <Option key={index} value={item.number}>{item.number}</Option>
            ))}
          </Select>
        )
      }}
    </Query>
    )
  }

  useEffect(() => {
    if (!visible) resetFields();
  }, [visible]);

  return (
    <Drawer
      width={"50%"}
      title={title}
      placement="right"
      closable={false}
      onClose={onCancel}
      visible={visible}>
      <Form className="ant-advanced-search-form" onSubmit={handleSave}>
        <Row gutter={6}>
          <Col lg={6}>
            <Form.Item label="Body Number">
              {/* {getFieldDecorator('body_number', {validateTrigger: ["onChange", "onBlur"],initialValue: taxi.body_number,rules: RequiredRule}) ( */}
                {BodyNumberList(taxi.body_number)}
              {/* )} */}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="Case Number">
              {getFieldDecorator('case_number', {rules: [...RequiredRule], initialValue: taxi.case_number})(
                <Input placeholder="##-##-####"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="Plate Number">
              {getFieldDecorator('plate_number', {rules: RequiredRule, initialValue: taxi.plate_number})(
                <Input placeholder="###-###"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="Engine Number">
              {getFieldDecorator('engine_number', {rules: RequiredRule, initialValue: taxi.engine_number})(
                <Input placeholder="#####-#######"/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col lg={6}>
            <Form.Item label="Chassis Number">
              {getFieldDecorator('chassis_number', {rules: RequiredRule, initialValue: taxi.engine_number})(
                <Input placeholder="#####-#######"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="Status">
              {getFieldDecorator('status', {validateTrigger: ["onChange", "onBlur"],initialValue: taxi.status,rules: RequiredRule})(
                <Select>
                  <Option value="RENT_TO_OWN">RENT_TO_OWN</Option>
                  <Option value="STRAIGTH">STRAIGTH</Option>
                  <Option value="24_HOURS">24_HOURS</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="CR Number">
              {getFieldDecorator('cr_number', {rules: RequiredRule, initialValue: taxi.cr_number})(
                <Input placeholder="########-##"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="CR Date issued">
                <DatePicker defaultValue={moment(taxi.cr_issued_at, dateFormat)} onChange={setCrIssuedAt}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col lg={6}>
            <Form.Item label="OR Number">
              {getFieldDecorator('or_number', {rules: RequiredRule, initialValue: taxi.or_number})(
                <Input placeholder="########-##"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="OR Date issued">
              <DatePicker defaultValue={moment(taxi.or_issued_at, dateFormat)} onChange={setOrIssuedAt}/>
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="Acquired Date">
              <DatePicker defaultValue={moment(taxi.acquired_at, dateFormat)} onChange={setAcquiredAt}/>
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="Sticker">
              {getFieldDecorator('sticker', {rules: RequiredRule, initialValue: taxi.sticker})(
                <Input placeholder="Sticker"/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col lg={6}>
            <Form.Item label="MV File Number">
              {getFieldDecorator('mv_file_number', {rules: RequiredRule, initialValue: taxi.mv_file_number})(
                <Input placeholder="7649-15996220720"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="Private Number">
              {getFieldDecorator('private_number', {rules: RequiredRule, initialValue: taxi.private_number})(
                <Input placeholder="7649-15996220720"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="Temporary Plate Number">
              {getFieldDecorator('temporary_plate_number', {rules: RequiredRule, initialValue: taxi.temporary_plate_number})(
                <Input placeholder="Temporary Plate Number"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="Year Model">
              {getFieldDecorator('year_model', {rules: RequiredRule, initialValue: taxi.year_model})(
                <Input placeholder="Year Model"/>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={6}>
          <Col lg={6}>
            <Form.Item label="Garage">
              {getFieldDecorator('garage_id', {initialValue: taxi.garage_id})(
                <Input placeholder="Garage"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="Company">
              {getFieldDecorator('company_id', {initialValue: taxi.company_id})(
                <Input placeholder="Company"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="Series">
              
              <Select defaultValue={taxi.series_id} onChange={setStatus}>
                <Option value="operable">Series</Option>
              </Select>

            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={12}>
            <Form.Item label="Notes">
              {getFieldDecorator('notes', {initialValue: taxi.notes})(
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

export default withApollo(Form.create()(TaxiDrawer));
