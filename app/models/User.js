const bcryptjs = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('User', {
    name: DataTypes.STRING,
    userType: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
  })

  Model.beforeSave(async (user) => {
    try {
      if (user.changed('password')) {
        const hash = await bcryptjs.hash(user.password, 10)
        user.password = hash
      }
    } catch (err) {
      console.log(err)
    }
  })

  return Model
}
