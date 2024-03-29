export const getParametersQueryPagination = (page = 1, rowsPerPage = 5) => {
  if (page < 1) page = 1;
  if (rowsPerPage < 1) rowsPerPage = 5;

  return {
    currentPage: page,
    skip: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
  };
};

export const paginateQuery = (data) => {
  return {
    list: data.items,
    totalItems: data.totalItems[0]?.count || 0,
    rowsPerPage: data.rowsPerPage,
    currentPage: data.currentPage,
    pages: Math.ceil((data.totalItems[0]?.count || 0) / data.rowsPerPage),
  };
};
