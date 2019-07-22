import {useState} from 'react';
import {Row, Modal, Table, Col, Icon, Input, Tag, Alert, PageHeader, Button, Divider} from 'antd';

import MainLayout from '../../layout/main';
import {PARTS_SUBSCRIPTION, DELETE_PART} from "./parts-gql";
import {Subscription} from 'react-apollo';
import PartModal from './parts-modal';
import ConfirmModal from './../../components/confirm-modal';

import {withApollo} from "react-apollo";

const {Search} = Input;
const PartList = props => {

  // States
  const [mode, setMode] = useState('add');
  const [part, setPart] = useState({});
  const [modalVisibility, showModalVisibility] = useState(false);
  const [confirmVisibility, showConfirmVisibility] = useState(false);
  const [toBeDeletedId, setToBeDeletedId] = useState(null);

  // Methods
  const handleEditMode = part => {
    console.log(part, 'part');
    setMode('edit');
    setPart(part);
    showModalVisibility(true);
  };

  const showOrCancelConfirmModal = (visible, id) => {
    setToBeDeletedId(id);
    showConfirmVisibility(visible);
  };

  const cancelPartModal = () => {
    setMode('add');
    setPart({});
    showModalVisibility(false);
  };

  const handleDelete = async () => {
    await props.client.mutate({
      mutation: DELETE_PART,
      variables: {
        id: toBeDeletedId
      }
    });

    showOrCancelConfirmModal(false, null);
  };

  const columns = ['name', 'code', 'quantity', 'description', 'created_at'].map(v => {
    const formattedTitle = v.split('_').reduce((g, i) => g + ' ' + i);
    let fields = {title: formattedTitle, dataIndex: v, key: v};
    if (v === 'actions') {
      return {
        ...fields, ...{
          render: (text, record) => (
            <span>
          <a href="javascript:;" onClick={() => handleEditMode(record)}>Edit</a>
          <Divider type="vertical"/>
          <a href="javascript:;" onClick={() => showOrCancelConfirmModal(true, record.id)}>Delete</a>
        </span>
          )
        }
      }
    }
    return fields;
  });

  const PartsList = (options) => (
    <Subscription subscription={PARTS_SUBSCRIPTION} variables={options} fetchPolicy="network-only">
      {({data, loading, error}) => {
        if (error) return `Error! ${error.message}`;
        return (
          <>
            <Table loading={loading} pagination={{pageSize: 15}} rowKey="id" dataSource={(!loading && data.parts) || []}
                   columns={columns}/>
          </>
        )
      }}
    </Subscription>
  );

  return (
    <MainLayout>
      <div className="page parts">
        <Row>
          <div className="right-content">
            <PageHeader title="Part's List">
              <div className="wrap">
                <div className="content">List of parts</div>
              </div>
              <Row className="mt-20">
                <Col span={12}>
                  <Button key="1" onClick={() => showModalVisibility(true)} type="primary"><Icon
                    type="plus"/>Part</Button>
                </Col>
                <Col offset={4} span={8}>
                  <Search placeholder="input search text" onSearch={value => console.log(value)} enterButton/>
                </Col>
              </Row>
            </PageHeader>

            <Alert className="mb-10" message="Informational Notes" type="info" showIcon/>

            {PartsList({limit: 15, offset: 10, order_by: {created_at: 'desc'}})}

            <ConfirmModal
              width='500'
              visible={confirmVisibility}
              centered
              content="Are you sure you want to delete this record?"
              okText='Yes'
              cancelText='Cancel'
              onCancel={() => showOrCancelConfirmModal(false, null)}
              onOk={() => handleDelete()}
            />

            <PartModal part={part} mode={mode} visible={modalVisibility} onOk={() => showModalVisibility(false)}
                       onCancel={() => cancelPartModal()}/>
          </div>
        </Row>
      </div>
    </MainLayout>
  )
};

export default withApollo(PartList);
