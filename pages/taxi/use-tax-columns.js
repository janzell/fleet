import {useColumnFormatter} from "../../hooks/use-column-formatter";
import {Tag} from 'antd';

const useTaxiColumns = ({handleFormMode, showOrCancelConfirmModal}) => {

  const fields = [
    'body_number',
    'case_number',
    'plate_number',
    'acquired_at',
    'engine_number',
    'year_model',
    'series.name'
  ];

  const dispatchStatusColor = {
    run: 'green',
    standby: 'blue'
  };

  const rentalStatusColor = {
    '24_HRS': '#87d068',
    'STRAIGHT': '#2db7f5',
    'RENT_TO_OWN': '#108ee9'
  };

  const columns = useColumnFormatter(fields, handleFormMode, showOrCancelConfirmModal, [{
    title: 'status',
    key: 'status',
    dataIndex: 'status',
    render: status => {
      return (
        <Tag color={rentalStatusColor[status]} key={status}>
          {status.toUpperCase()}
        </Tag>
      )
    }
  }, {
    title: 'Dispatch Status',
    key: 'dispatch_status',
    dataIndex: 'dispatch_status',
    render: status => {
      return (
        <Tag color={dispatchStatusColor[status]} key={status}>
          {status.toUpperCase()}
        </Tag>
      )
    }
  }]);

  return [columns];
};

export default useTaxiColumns;
