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
    'series.name',
    'created_at',
    'updated_at'
  ];

  const columns = useColumnFormatter(fields, handleFormMode, showOrCancelConfirmModal, [{
    title: 'status',
    key: 'status',
    dataIndex: 'status',
    render: status => {
      const color = (status === '24_HRS') ? 'blue' : 'green';
      return (
        <Tag color={color} key={status}>
          {status.toUpperCase()}
        </Tag>
      )
    }
  }]);

  return [columns];
};

export default useTaxiColumns;
