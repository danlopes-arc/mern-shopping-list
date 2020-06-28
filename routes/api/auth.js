const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
      { expiresIn: 60 }
    )

    return res.json({
      user: {
        name: user.name,
        email,
        token
      }
    })
  })

module.exports = router