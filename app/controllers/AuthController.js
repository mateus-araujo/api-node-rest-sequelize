const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const validator = require('validator')
const sgMail = require('@sendgrid/mail')

const { User } = require('../models')

require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const generateToken = (params = {}) => {
  return jwt.sign(params, process.env.JWT_ENCRYPTION, {
    expiresIn: process.env.JWT_EXPIRATION,
  })
}

const create = async (req, res) => {
  const { email } = req.body
  const { userType } = req.body

  try {
    if (await User.findOne({ where: { email: email } }))
      return res.status(400).send({ error: 'User already exists' })

    if (userType != 'user' && userType != 'admin') {
      return res.status(400).send({ error: 'Invalid userType' })
    }

    if (!validator.isEmail(email)) {
      return res.status(400).send({ error: 'Invalid email' })
    }

    const user = await User.create(req.body)

    user.password = undefined

    return res.status(200).send({
      user,
      token: generateToken({ id: user.id })
    })
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: 'Registration failed' })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: { email: email } })

    if (!user)
      return res.status(400).send({ error: 'User not found' })

    if (!await bcryptjs.compare(password, user.password))
      return res.status(400).send({ error: 'Invalid password' })

    user.password = undefined

    res.send({
      user,
      token: generateToken({ id: user.id }),
    })
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: err })
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ where: { email: email } })

    if (!user)
      return res.status(400).send({ error: 'User not found' })

    const token = crypto.randomBytes(20).toString('hex')

    const now = new Date()
    now.setHours(now.getHours() + 1)

    console.log('token: ' + token)

    user.passwordResetToken = token
    user.passwordResetExpires = now

    await user.save()

    const msg = {
      to: process.env.SENDGRID_TO,
      from: process.env.SENDGRID_FROM,
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: `<strong>Try to sign in again with this: http://localhost:${process.env.PORT}/${user.email}/${token}</strong>`,
    }
    sgMail.send(msg).catch((err) => console.log(err))

    res.send()

  } catch (err) {
    console.log(err)
    res.status(400).send({ error: 'Error on forgot password, try again' })
  }
}

const resetPassword = async (req, res) => {
  const { email, token, password } = req.body

  try {
    const user = await User.findOne({ where: { email: email } })
    console.log('user.passwordResetToken: ' + user.passwordResetToken)
    console.log('token' + token)

    if (!user)
      return res.status(400).send({ error: 'User not found' })

    if (token !== user.passwordResetToken)
      return res.status(400).send({ error: 'Token invalid' })

    const now = new Date()

    if (now > user.passwordResetExpires)
      return res.status(400).send({ error: 'Token expired, generate a new one' })

    user.password = password

    await user.save()

    res.send()
  } catch (err) {
    res.status(400).send({ error: 'Cannot reset password, try again' })
  }
}

module.exports = {
  create,
  login,
  forgotPassword,
  resetPassword
}
