
const jwt = require('jsonwebtoken');
const generateToken = (NguoiDungId, Account) => {
  return jwt.sign({ id: NguoiDungId, Account }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

const verifyToken = (token) => {

  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
