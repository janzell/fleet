import {Button, Modal} from 'antd';

const ConfirmModal = props => {
  return (
    <Modal
      width={props.width}
      visible={props.visible}
      centered
      onCancel={props.onCancel}
      onOk={props.onOk}>
      <div className="card-content-wrap mt-20 pt-20">
        <p className="card-content">{props.content}</p>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
