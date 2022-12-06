module.exports = (sequelize, Sequelize) => {
    const Set = sequelize.define("sets", {
    
      name: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.STRING
      },
      subject:{
        type: Sequelize.STRING
      },
      points: {
        type: Sequelize.INTEGER
      }
    
    });
    return Set;
  };