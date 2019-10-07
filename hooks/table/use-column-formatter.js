import columnsTitleFormatter from "../../utils/table-columns-formatter";
import {Divider, Icon} from "antd";

export default function useColumnFormatter(fields, handleFormMode, showOrCancelConfirmModal, overrides =  []) {
  let overridesList = [{
    title: 'Actions',
    dataIndex: 'actions',
    width: 110,
    key: 'actions',
    render: (text, record) => (
      <span>
       <a href="javascript:;" onClick={() => handleFormMode(record)}><Icon type="eye"/></a>
        <Divider type="vertical"/>
        <a href="javascript:;" onClick={() => handleFormMode(record)}><Icon type="edit"/></a>
        <Divider type="vertical"/>
        <a href="javascript:;" onClick={() => showOrCancelConfirmModal(true, record.id)}><Icon type="delete"/></a>
      </span>
    )
  }];

  // Merge the additional overrides.
  if (overrides) {
    overridesList = overrides.concat(overridesList);
  }

  return columnsTitleFormatter(fields, overridesList);
}
