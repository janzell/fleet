import {Row, Col, Button, Drawer, Typography} from 'antd';

import DropUnitsList from './drop-units-list';
import {formatTitle} from '../../hooks/use-column-formatter';


const {Title, Text} = Typography;

const TaxiDetailDrawer = (props) => {

  const {onCancel, title, visible, taxi} = props;

  function handleDropUnit() {

  }

  const columns = [
    'plate_number',
    'body_number',
    'engine_number',
    'case_number',
    'acquired_at',
    'year_model',
    'status',
    'sticker',
    'or_number',
    'or_issued_at',
    'cr_number',
    'cr_issued_at',
    'notes',
    'series_id',
    'mv_file_number',
    'private_number',
    'temporary_plate_number',
    'created_at',
    'updated_at',
  ];

  const TaxiItems = (taxi) => {
    return (
      <Row>
        {columns.map(key => {
          return (
            <Col key={key} span={8}>
              <Text strong>{formatTitle(key)}</Text>
              : {taxi[key]}
            </Col>
          )
        })}
      </Row>
    )
  };

  return (
    <Drawer
      width={"80%"}
      title={title}
      placement="right"
      closable={false}
      onClose={onCancel}
      visible={visible}>

      <Title level={4}>Taxi Detail</Title>

      {TaxiItems(taxi)}

      <Title level={4}>Assigned Driver</Title>

      <Title level={4}>History</Title>
      <DropUnitsList taxi={taxi}/>

      <div className="button-container">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleDropUnit}>Drop</Button>
      </div>
    </Drawer>
  )
};

export default TaxiDetailDrawer;
