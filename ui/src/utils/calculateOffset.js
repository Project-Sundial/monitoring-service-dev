const calculateOffset = (page, pageLimit) => {
  return (page - 1) * pageLimit;
};

export default calculateOffset;
