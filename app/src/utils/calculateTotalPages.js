const calculateTotalPages = (pageSize, totalEntries) => {
  return Math.ceil(totalEntries / pageSize);
};

export default calculateTotalPages;
