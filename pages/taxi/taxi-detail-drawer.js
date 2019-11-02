import {Drawer, Typography} from 'antd';
import DropUnitsList from './drop-units-list';


const {Title} = Typography;

const TaxiDetailDrawer = (props) => {

  const {onCancel, title, visible} = props;


  return (
    <Drawer
      width={"80%"}
      title={title}
      placement="right"
      closable={false}
      onClose={onCancel}
      visible={visible}>
      <Title level={4}>Taxi Details</Title>

      <Title level={4}>Drop Units</Title>
      <DropUnitsList/>
    </Drawer>
  )
};

export default TaxiDetailDrawer;
