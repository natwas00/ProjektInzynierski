module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      login: {
        type: Sequelize.STRING
      },
      points: {
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING
      }
    });
    return User;
  };