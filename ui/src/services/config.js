let token;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getConfig = () => {
  return {
    headers: {
      Authorization: token,
    }
  };
};

export {
  setToken,
  getConfig,
};
