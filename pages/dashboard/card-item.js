import {Card} from 'antd';

const CardItem = ({title, content}) => {

  return (
    <Card>
      <h1>{title}</h1>
      <div>{content}</div>
    </Card>
  )
};

export default CardItem;
