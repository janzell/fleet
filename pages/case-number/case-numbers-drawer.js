import moment from 'moment';

import {withApollo} from "react-apollo";
import {useEffect} from "react";

import {Form, Input, Button, Row, Col, DatePicker, Drawer} from 'antd';

import {RequiredRule} from '../../lib/form-rules';
import {ADD_CASE_NUMBER, GET_CASE_NUMBER_LIST, UPDATE_CASE_NUMBER} from "./case-numbers-gql";

import {errorNotification, successNotification} from '../../hooks/use-notification';

const {TextArea} = Input;

const CaseNumberDrawer = props => {
  const {client, caseNumber, listOptions, title, onCancel, visible} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  const handleSave = (e) => {
    e.preventDefault();

    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isEditMode = (caseNumber.number);
        const action = isEditMode ? 'updated' : 'added';

        values.updated_at = moment().format('YYYY-MM-D HH:mm:ss');

        const result = isEditMode
          ? mutateCaseNumber(UPDATE_CASE_NUMBER, {number: caseNumber.number, case_numbers: values})
          : mutateCaseNumber(ADD_CASE_NUMBER, {case_numbers: values});

        result.then(() => {
          successNotification(`Case number was successfully ${action}.`);
          resetFields();
          onCancel();
        }).catch(err => {
          errorNotification(`Case number ${action} failed. Reason: ${err.message}`);
        });
      }
    });
  };

  const mutateCaseNumber = async (mutation, variables) => {
    return await client.mutate({
      mutation,
      variables,
      refetchQueries: [{query: GET_CASE_NUMBER_LIST, variables: listOptions}]
    });
  };

  useEffect(() => {
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
            <Form.Item label="Number">
              {getFieldDecorator('number', {rules: RequiredRule, initialValue: caseNumber.number})(
                <Input placeholder="Number"/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={24}>
            <Form.Item label="Expired At">
              {getFieldDecorator('expired_at', {
                rules: [{
                  type: 'object',
                  required: true,
                  message: 'Please select expired date!'
                }], initialValue: moment(caseNumber.expired_at)
              })(
                <DatePicker/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={24}>
            <Form.Item label="Notes">
              {getFieldDecorator('notes', {initialValue: caseNumber.notes})(
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

export default withApollo(Form.create()(CaseNumberDrawer));
