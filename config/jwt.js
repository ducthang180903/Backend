
const jwt = require('jsonwebtoken');
const generateToken = (userId, Account) => {
  return jwt.sign({ id: userId, Account }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
