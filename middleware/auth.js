const jwt = require('jsonwebtoken')

module.exports = function auth(req, res, next) {
  const token = req.header('x-auth-token')

  if (!token) {
    return res.status(401).json({ msg: 'no auth token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded;
    return next()
    
  } catch (err) {
    return res.status(400).json({msg: 'invalid auth token'})
  }

}