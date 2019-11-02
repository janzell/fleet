import {withApollo} from "react-apollo";
import {useEffect} from "react";
import moment from 'moment';

import {Form, Input, Button, Row, Col, Drawer} from 'antd';

import {RequiredRule} from '../../lib/form-rules';
import {ADD_SERIES, GET_SERIES_LIST, UPDATE_SERIES} from "./../../queries/series-gql";

import {errorNotification, successNotification} from "../../hooks/use-notification";

const {TextArea} = Input;

const SeriesDrawer = props => {
  const {client, series, listOptions, title, onCancel, visible} = props;
  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  const handleSave = (e) => {
    e.preventDefault();

    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isEditMode = (series.id);
        const action = isEditMode ? 'Updated' : 'Added';

        values.updated_at = moment().format('YYYY-MM-D HH:mm:ss');

        const result = isEditMode
          ? mutateSeries(UPDATE_SERIES, {id: series.id, series: values})
          : mutateSeries(ADD_SERIES, {series: values});

        result.then(() => {
          successNotification(`Series was successfully ${action}.`);
          resetFields();
          onCancel();
        }).catch(err => {
          errorNotification(`Series ${action} failed. Reason: ${err.message}`);
        });
      }
    });
  };

  const mutateSeries = async (mutation, variables) => {
    return await client.mutate({
      mutation,
      variables,
      refetchQueries: [{query: GET_SERIES_LIST, variables: listOptions}]
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
            <Form.Item label="Name">
              {getFieldDecorator('name', {rules: RequiredRule, initialValue: series.name})(
                <Input placeholder="Name"/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={24}>
            <Form.Item label="Notes">
              {getFieldDecorator('notes', {initialValue: series.notes})(
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

export default withApollo(Form.create()(SeriesDrawer));
