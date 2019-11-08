import {Tabs, Drawer, Descriptions} from 'antd';
import {formatTitle} from "../../hooks/use-column-formatter";

const {TabPane} = Tabs;

const DriverDetailDrawer = (props) => {

  const {onCancel, visible, driver} = props;

  const DriverItems = (records = []) => {
    return (
      <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
        {records.map((record) => {
          console.log(record);
          return (Object.keys(record).map(item => {
            return <Descriptions.Item key={item} label={formatTitle(item)}>{record[item]}</Descriptions.Item>
          }))
        })}
      </Descriptions>
    )
  };

  const excludeObjectFields = [
    'educational_attainments',
    'employment_histories',
    'character_references',
    'other_infos',
    'id',
    '__typename'
  ];

  const personalData = (driver, excludeObjectFields) => {
    let details = {};

    if (driver) {
      const filtered = Object.keys(driver).filter(i => {
        return !excludeObjectFields.includes(i);
      });

      filtered.forEach(key => {
        details[key] = driver[key];
      })
    }

    return [details];
  };

  return (
    <Drawer
      width="80%"
      title='Drivers Detail'
      placement="right"
      closable={false}
      onClose={onCancel}
      visible={visible}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Personal Data" key="1">
          {DriverItems(personalData(driver, excludeObjectFields))}
        </TabPane>
        <TabPane tab="Education Attainment" key="2">
          {DriverItems(driver.educational_attainments)}
        </TabPane>
        <TabPane tab="Employment History" key="3">
          {DriverItems(driver.employment_histories)}
        </TabPane>
        <TabPane tab="Character Reference" key="4">
          {DriverItems(driver.character_references)}
        </TabPane>
        <TabPane tab="Other Info" key="5">
          {DriverItems(driver.other_infos)}
        </TabPane>
      </Tabs>
    </Drawer>
  )
};

export default DriverDetailDrawer;

