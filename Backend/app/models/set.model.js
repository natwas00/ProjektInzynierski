module.exports = (sequelize, Sequelize) => {
    const Set = sequelize.define("sets", {
      // id: {
      //   type: Sequelize.INTEGER,
      //   primaryKey: true
      // },
    
      name: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.STRING
      },
      subject:{
        type: Sequelize.STRING
      }
    
    });
    return Set;
  };