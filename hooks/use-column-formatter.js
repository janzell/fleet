import {Divider, Icon} from "antd";

const formatTitle = (v) => v.split('_').join(' ').split('.').join(' ');

/**
 * Column formatter
 *
 * @param titles
 * @param overrides
 * @return {T[]}
 */
const titlesFormatter = (titles, overrides) => {
  let formatted_fields = titles.map(v => {
    let title = formatTitle(v);
    return {title, dataIndex: v, key: v};
  });

  return (overrides) ? formatted_fields.concat(overrides) : formatted_fields;
};

const ViewAction = (handleFormMode, record) => {
  return (
    <>
      <a href="javascript:;" onClick={() => handleFormMode(record, 'view')}><Icon type="eye"/></a>
      <Divider type="vertical"/>
    </>
  )
};

const EditAction = (handleFormMode, record) => {
  return (
    <>
      <a href="javascript:;" onClick={() => handleFormMode(record)}><Icon type="edit"/></a>
      <Divider type="vertical"/>
    </>
  )
};

const DeleteAction = (showOrCancelConfirmModal, record) => {
  return (<a href="javascript:;" onClick={() => showOrCancelConfirmModal(true, record)}><Icon type="delete"/></a>);
};

/**
 * Table column formatter
 * @param fields
 * @param handleFormMode
 * @param showOrCancelConfirmModal
 * @param overrides
 * @return {T[]}
 */
const useColumnFormatter = (fields, handleFormMode, showOrCancelConfirmModal, overrides = []) => {

  let overridesList = (handleFormMode && showOrCancelConfirmModal)
    ? [{
      title: 'Actions',
      dataIndex: 'actions',
      width: 110,
      key: 'actions',
      render: (text, record) => (
        <span>
          {handleFormMode && ViewAction(handleFormMode, record)}
          {handleFormMode && EditAction(handleFormMode, record)}
          {showOrCancelConfirmModal && DeleteAction(showOrCancelConfirmModal, record)}
        </span>
      )
    }]
    : [];

  // Merge the additional overrides.
  if (overrides) {
    overridesList = overrides.concat(overridesList);
  }

  return titlesFormatter(fields, overridesList);
};

export {useColumnFormatter, titlesFormatter, formatTitle}
