import jwt from 'jsonwebtoken';
import { compareWithHash } from '../utils/bcrypt.js';
import { dbGetUserByUsername } from '../db/queries.js';

const login = async (request, response, next) => {
  try {
    const { username, password } = request.body;
    const user = await dbGetUserByUsername(username);
    let passwordCorrect;
    if (user) {
      passwordCorrect = await compareWithHash(password, user.password_hash);
    }

    if (!(user && passwordCorrect)) {
      const error = new Error('Invalid username or password.');
      error.statusCode = 401;
      throw error;
    }

    const userForToken = {
      id: user.id,
      username: user.username,
    };

    const token = jwt.sign(
      userForToken,
      process.env.SECRET,
      { expiresIn: 15 } // 15 second expiration - testing purposes only!
    );

    response.status(200).send({
      username: user.username, token
    });
  } catch (error) {
    next(error);
  }
};

export {
  login,
};
