import moment from 'moment';
import {Form, Input, Select, DatePicker, Row, Col, Drawer, Button} from 'antd';

import {withApollo} from "react-apollo";
import {useEffect, useState} from "react";

import {RequiredRule} from '../../lib/form-rules';
import {ADD_TAXI, GET_TAXIS_LIST, UPDATE_TAXI} from "../../queries/taxi-gql";

import {errorNotification, successNotification} from "../../hooks/use-notification";

import CompanyList from '../../components/form/company-list';
import GarageList from '../../components/form/garage-list';
import SeriesList from '../../components/form/series-list';
import YearModelList from '../../components/form/year-model-list';
import CaseNumberList from '../../components/form/case-number-list';
import BodyNumberList from '../../components/form/body-number-list';

const {TextArea} = Input;
const {Option} = Select;

const TaxiDrawer = props => {

  const {client, taxi, onCancel, title, visible, listOptions} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  const [setCrIssuedAt] = useState();
  const [setOrIssuedAt] = useState();
  const [setAcquiredAt] = useState();

  const dateFormat = 'YYYY/MM/DD';

  // TODO: use custom hooks
  const handleSave = (e) => {
    e.preventDefault();

    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isEditMode = (taxi.id);
        const action = isEditMode ? 'Updated' : 'Added';

        const result = isEditMode
          ? mutateTaxi(UPDATE_TAXI, {id: taxi.id, taxi: values})
          : mutateTaxi(ADD_TAXI, {taxi: values});

        result.then(() => {
          successNotification(`Taxi was successfully ${action}.`);
          resetFields();
          onCancel();
        }).catch(err => {
          errorNotification(`Taxi ${action} failed. Reason: ${err.message}`);
        });
      }
    });
  };

  const mutateTaxi = async (mutation, variables) => {
    return await client.mutate({
      mutation,
      variables,
      refetchQueries: [{query: GET_TAXIS_LIST, variables: listOptions}]
    });
  };

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
            <BodyNumberList {...props}/>
          </Col>
          <Col lg={6}>
            <CaseNumberList {...props}/>
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
              {getFieldDecorator('status', {
                validateTrigger: ["onChange", "onBlur"],
                initialValue: taxi.status,
                rules: RequiredRule
              })(
                <Select>
                  <Option value="RENT_TO_OWN">RENT_TO_OWN</Option>
                  <Option value="STRAIGHT">STRAIGHT</Option>
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
              <DatePicker defaultValue={moment(taxi.cr_issued_at || 'now', dateFormat)} onChange={setCrIssuedAt}/>
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
              {getFieldDecorator('temporary_plate_number', {
                rules: RequiredRule,
                initialValue: taxi.temporary_plate_number
              })(
                <Input placeholder="Temporary Plate Number"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <YearModelList {...props}/>
          </Col>
        </Row>

        <Row gutter={6}>
          <Col lg={6}>
            <GarageList {...props}/>
          </Col>
          <Col lg={6}>
            <CompanyList {...props}/>
          </Col>
          <Col lg={6}>
            <SeriesList {...props}/>
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
