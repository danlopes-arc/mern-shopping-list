const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../../middleware/auth')

const User = require('../../models/User')

router.route('/')
  .post(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ msg: 'Invalid input' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' })
    }

    try {
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(403).json({ msg: 'wrong password' })
      }
    } catch (err) {}
    
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: parseInt(process.env.JWT_EXPIRATION_SECONDS) }
    )

    return res.json({
      token,
      user: {
        name: user.name,
        email,
      }
    })
  })

router.route('/user')
  .get(auth, async (req, res) => {
    const user = await User.findById(req.user.id)
      .select('-password')
    return res.json(user)
  })

module.exports = router