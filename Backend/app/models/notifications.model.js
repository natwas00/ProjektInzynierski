module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("notification", {
    
      content: {
        type: Sequelize.STRING
      },
      classId: {
        type: Sequelize.INTEGER
      },
      setId:{
        type: Sequelize.INTEGER
      },
      userId:{
        type: Sequelize.INTEGER
      },
      if_read:{
        type: Sequelize.STRING
      }
    
    });
    return Notification;
  };