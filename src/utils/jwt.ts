const jwt = require('jsonwebtoken');

export const createJWT = (payload: any) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
};

export const isTokenValid = (token: string) => jwt.verify(token, process.env.JWT_SECRET);
