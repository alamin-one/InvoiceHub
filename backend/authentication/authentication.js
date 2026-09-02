const { verify } = require('jsonwebtoken');

const authentication = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied!!',
    });
  }

  try {
    const payload = verify(token, process.env.JWT_PRIVATE_KEY);
    res.locals.storeId = payload.storeId;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid Token',
    });
  }
};
const checkAuth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authenticated successfully',
  });
};    

module.exports = authentication;
