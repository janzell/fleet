import {withApollo} from "react-apollo";
import {useEffect} from "react";
import moment from 'moment';

import {Form, Input, Button, Row, Col, Drawer} from 'antd';

import {RequiredRule} from '../../lib/form-rules';
import {ADD_YEAR_MODEL, GET_YEAR_MODEL_LIST, UPDATE_YEAR_MODEL} from "./../../queries/year-model-gql";
import {errorNotification, successNotification} from "../../hooks/use-notification";

const {TextArea} = Input;

const YearModelDrawer = props => {
  const {client, yearModel, listOptions, title, onCancel, visible} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;


  const handleSave = (e) => {
    e.preventDefault();

    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isEditMode = (yearModel.name);
        const action = isEditMode ? 'updated' : 'added';

        values.updated_at = moment().format('YYYY-MM-D HH:mm:ss');

        const result = isEditMode
          ? mutateYearModel(UPDATE_YEAR_MODEL, {name: yearModel.name, year_models: values})
          : mutateYearModel(ADD_YEAR_MODEL, {year_models: values});

        result.then(() => {
          successNotification(`Year model was successfully ${action}.`);
          resetFields();
          onCancel();
        }).catch(err => {
          errorNotification(`Year model ${action} failed. Reason: ${err.message}`);
        });
      }
    });
  };

  const mutateYearModel = async (mutation, variables) => {
    return await client.mutate({
      mutation,
      variables,
      refetchQueries: [{query: GET_YEAR_MODEL_LIST, variables: listOptions}]
    });
  };

  useEffect(() => {
    // Reset the form fields when there's a change on the visible props.
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
            <Form.Item label="Name">
              {getFieldDecorator('name', {rules: RequiredRule, initialValue: yearModel.name})(
                <Input placeholder="Name"/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={24}>
            <Form.Item label="Notes">
              {getFieldDecorator('notes', {initialValue: yearModel.notes})(
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

export default withApollo(Form.create()(YearModelDrawer));
