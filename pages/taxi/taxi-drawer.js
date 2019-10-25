import moment from 'moment';
import {Form, Input, Select, DatePicker, Row, Col, Drawer, Button, notification} from 'antd';

import {withApollo, Query} from "react-apollo";
import {useEffect, useState} from "react";

import {RequiredRule} from '../../lib/form-rules';
import {ADD_TAXI, GET_TAXIS_LIST, UPDATE_TAXI} from "./taxi-gql";

// TODO: TO BE TRANSFERRED INTO COMPONENTS
import {ALL_BODY_NUMBERS} from './../body-number/body-numbers-gql';
import {ALL_CASE_NUMBERS} from './../case-number/case-numbers-gql';
import {ALL_GARAGE} from "../garage/garage-gql";
import {ALL_COMPANIES} from '../company/company-gql';
import {ALL_SERIES} from '../series/series-gql';

const {TextArea} = Input;
const {Option} = Select;

const TaxiDrawer = props => {

  const {client, taxi, onCancel, title, visible, listOptions} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  const [setStatus] = useState();
  const [setCrIssuedAt] = useState();
  const [setOrIssuedAt] = useState();
  const [setAcquiredAt] = useState();

  const dateFormat = 'YYYY/MM/DD';

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({message, description});
  };

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

        result.then(res => {
          openNotificationWithIcon('success', 'Success', `Taxi ${action} successfully`);
          resetFields();
          onCancel();
        }).catch(err => {
          openNotificationWithIcon('error', 'Error', `Taxi ${action} failed. Reason: ${err.message}`);
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

  // TODO: compose a new component
  const CaseNumberList = (taxi) => {
    return (
      <Query query={ALL_CASE_NUMBERS}>
        {({loading, error, data}) => {
          if (error) return 'error';
          if (loading) return 'loading';
          return (
            <Form.Item label="Case Number">
              {getFieldDecorator('case_number', {rules: [...RequiredRule], initialValue: taxi.case_number})(
                <Select showSearch={true}>
                  {data.case_numbers.map((item, index) => (
                    <Option key={index} value={item.number}>{item.number}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )
        }}
      </Query>
    )
  };

  // TODO: compose a new component
  const BodyNumberList = (taxi) => {
    return (
      <Query query={ALL_BODY_NUMBERS}>
        {({loading, error, data}) => {
          if (error) return 'error';
          if (loading) return 'loading';
          return (
            <Form.Item label="Body Number">
              {getFieldDecorator('body_number', {rules: [...RequiredRule], initialValue: taxi.body_number})(
                <Select showSearch={true}>
                  {data.body_numbers.map((item, index) => (
                    <Option key={index} value={item.number}>{item.number}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )
        }}
      </Query>
    )
  };

  const GarageList = (taxi) => {
    return (
      <Query query={ALL_GARAGE}>
        {({loading, error, data}) => {
          if (error) return 'error';
          if (loading) return 'loading';
          return (
            <Form.Item label="Garage">
              {getFieldDecorator('garage_id', {rules: [{required: true}], initialValue: taxi.garage_id})(
                <Select showSearch={true}>
                  {data.garages.map((item, index) => (
                    <Option key={index} value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )
        }}
      </Query>
    )
  };


  const CompanyList = (taxi) => {
    return (
      <Query query={ALL_COMPANIES}>
        {({loading, error, data}) => {
          if (error) return 'error';
          if (loading) return 'loading';
          return (
            <Form.Item label="Company">
              {getFieldDecorator('company_id', {rules: [{required: true}], initialValue: taxi.company_id})(
                <Select showSearch={true}>
                  {data.companies.map((item, index) => (
                    <Option key={index} value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )
        }}
      </Query>
    )
  };


  const SeriesList = (taxi) => {
    return (
      <Query query={ALL_SERIES}>
        {({loading, error, data}) => {
          if (error) return 'error';
          if (loading) return 'loading';
          return (
            <Form.Item label="Series">
              {getFieldDecorator('series_id', {rules: [{required: true}], initialValue: taxi.series_id})(
                <Select showSearch={true}>
                  {data.series.map((item, index) => (
                    <Option key={index} value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )
        }}
      </Query>
    )
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
            {BodyNumberList(taxi)}
          </Col>
          <Col lg={6}>
            {CaseNumberList(taxi)}
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
            <Form.Item label="Year Model">
              {getFieldDecorator('year_model', {rules: RequiredRule, initialValue: taxi.year_model})(
                <Input placeholder="Year Model"/>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={6}>
          <Col lg={6}>
            {GarageList(taxi)}
          </Col>
          <Col lg={6}>
            {CompanyList(taxi)}
          </Col>
          <Col lg={6}>
            { SeriesList(taxi)}
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
