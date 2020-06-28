const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../../models/User')

router.route('/')
  .post(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Invalid input' })
    }

    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ msg: 'User already exists' })
    }

    const hash = await bcrypt.hash(password, 12)

    const newUser = await new User({
      name,
      email,
      password: hash
    }).save()

    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION_SECONDS }
    )

    return res.json({
      user: {
        name,
        email,
        token
      }
    })
  })

module.exports = router