module.exports = (sequelize, Sequelize) => {
    const Class_task = sequelize.define("class_task", {
      task: {
        type: Sequelize.STRING
      },
      classId:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      finishDate:{
        type:Sequelize.DATEONLY
      }
    });
    return Class_task;
  };