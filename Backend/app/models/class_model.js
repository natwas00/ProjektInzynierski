module.exports = (sequelize, Sequelize) => {
    const Class = sequelize.define("class", {
      name: {
        type: Sequelize.STRING,
        
      },
      strudents_number: {
        type: Sequelize.INTEGER
      },
      userId:{
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
    return Class;
  };