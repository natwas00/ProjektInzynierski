module.exports = (sequelize, Sequelize) => {
    const Class = sequelize.define("students_in_class", {
      studentId: {
        type: Sequelize.INTEGER,
        
      },
      classId: {
        type: Sequelize.INTEGER
      }
    });
    return Class;
  };