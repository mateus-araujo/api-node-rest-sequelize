const { User } = require('../models')

const index = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    })

    return res.status(200).send({ users, user: req.user_id })
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: err })
  }
}

const show = async (req, res) => {
  const { user_id } = req.params

  try {
    const user = await User.findById(user_id)

    user.password = undefined

    return res.send({ user })
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: err })
  }
}

const update = async (req, res) => {
  const { user_id } = req.params
  const data = req.body
  let user = user_id

  try {
    if (req.params.user_id)
      user = await User.findById(user_id)

    if (!req.params.user_id)
      user = await User.findById(req.user_id)

    user.set(data)
    await user.save()

    return res.send({ user })
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: err })
  }
}

const destroy = async (req, res) => {
  const { user_id } = req.params
  let user = user_id

  try {
    user = await User.findById(user_id)

    await user.destroy()

    return res.status(204).send()
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: 'Error deleting user' })
  }
}

module.exports = {
  index,
  show,
  update,
  destroy,
}
