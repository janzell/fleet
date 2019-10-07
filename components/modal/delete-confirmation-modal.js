import ConfirmModal from "../confirm-modal";

const DeleteConfirmationModal = props => {
  return (<ConfirmModal
    width='500'
    visible={props.visible}
    centered
    content="Are you sure you want to delete this record?"
    okText='Yes'
    cancelText='Cancel'
    onCancel={props.onCancel}
    onOk={props.onOk}
  />)
};

export default DeleteConfirmationModal;
