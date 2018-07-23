# api-node-sequelize

## Installation and usage
- git clone https://github.com/mateus-araujo/api-node-rest-sequelize.git
- cd api-node-rest-sequelize-master
- npm install
- configure a .env file
- create a database
- node_modules/.bin/sequelize db:migrate
- npm start

## Features
- Routing with ExpressJS
- Sequelize ORM
- AuthController with authentication, forgot_password(via email Sendgrid), reset_password
- UserController with crud operations
- User model and migration
