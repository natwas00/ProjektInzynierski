module.exports = (sequelize, Sequelize) => {
    const UsersAndsets = sequelize.define("users&sets", {
      points: {
        type: Sequelize.INTEGER
      },
      last_access: {
        type: Sequelize.DATE
      }
    });
    return UsersAndsets;
  };