import bcrypt from 'bcryptjs';

const generateHash = async (password) => {
  const saltRounds = 10;
  const passwordHash = await new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (error, salt) => {
      if (error) {
        reject(error);
      }

      bcrypt.hash(password, salt, (error, hash) => {
        if (error) {
          reject(error);
        }

        resolve(hash);
      });
    });
  });

  return passwordHash;
};

const compareWithHash = async (password, hash) => {
  const result = await new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });

  return result;
};

export {
  generateHash,
  compareWithHash,
};
