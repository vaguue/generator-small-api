export function filter({ ...other }) {
  return [
    { 
      $match: {
        ...other,
      }
    },
  ];
}

export function count({ per, page, ...other }) {
  return [
    ...filter({ ...other }),
    {
      $count: 'count',
    }
  ];
}

export function slice(q) {
  const { per, page, sorting, ...other } = q;
  return [
    ...filter({ ...other }),
    ...(sorting == 'date' ? [ { $sort: { dateCreate: -1 } } ] : []),
    {
      $skip: per*page,
    },
    {
      $limit: per,
    },
  ];
}
