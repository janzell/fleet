const columnsTitleFormatter = (titles, overrides) => {
  let formatted_fields = titles.map(v => {
    return {title: v.split('_').join(' '), dataIndex: v, key: v};
  });

  return formatted_fields.concat(overrides);
};

export default columnsTitleFormatter;
