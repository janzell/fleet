const columnsTitleFormatter = (titles, overrides) => {
  let formatted_fields = titles.map(v => {
    let title = v.split('_').join(' ').split('.').join(' '); 
    return {title, dataIndex: v, key: v};
  });

  return formatted_fields.concat(overrides);
};

export default columnsTitleFormatter;
