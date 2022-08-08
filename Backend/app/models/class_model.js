module.exports = (sequelize, Sequelize) => {
    const Class = sequelize.define("classes", {
      name: {
        type: Sequelize.STRING,
        
      },
      strudents_number: {
        type: Sequelize.INTEGER
      },
      classLevel: {
        typr: Sequelize.STRING
      },
      userId:{
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
    return Class;
  };