let token;

const setToken = (newToken) => {
  token = `Bearer ${token}`;
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
