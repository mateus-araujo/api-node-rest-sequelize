'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userType: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['user', 'admin']
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
        validate: {
          isEmail: true,
        }
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      passwordResetToken: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      passwordResetExpires: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    })
  },

  down: (queryInterface) => {
    queryInterface.dropTable('Users')
  }
}
