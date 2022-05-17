module.exports = (sequelize, Sequelize) => {
    const FinalTest= sequelize.define("finalTests", {
     
      stars_number: {
        type: Sequelize.INTEGER
      },
      question_number: {
        type: Sequelize.INTEGER
      },
      points:{
        type: Sequelize.INTEGER
      } 
    
      
    });
    return FinalTest;
  };