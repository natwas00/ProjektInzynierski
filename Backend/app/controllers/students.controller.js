const db = require("../models");
const ClassList = db.classList;
const Class = db.class;
const Users = db.user;

exports.addStudents = (req, res) => {
    Class.findOne({
        where: {
            id: req.body.classId
        }
    })
    .then(classInDB => {
        if (!classInDB) {
            return res.status(200).send({ message: "No such class" });
        }
        
        array_with_data=[]
              for (i in req.body.studentId){
                array_with_data.push({
                  classId: req.body.classId,
                  studentId: req.body.studentId[i]
                })
               
               
              }
              if (array_with_data){
                ClassList.bulkCreate(
                  array_with_data
                ).then(data=>{
                    res.status(200).send({ message: "Students added" });
                })
            }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
      });
};

exports.getStudentsFromClass = (req, res) => {
  {
    Class.findOne({
      where: {
          id: req.body.classId
      }
  })
  .then( classInDB => {
    if (!classInDB) {
      return res.status(200).send({ message: "No such class" });
  }
    students = []
    ClassList.findAll({
      where:{
        classId: classInDB.id
      }
    })
    .then(data=>{
      dataCount = 0
      data.forEach(element => {
        dataCount = dataCount + 1
      });
      for (let i = 0; i < dataCount; i++) {
        Users.findOne({
          where: {
            id: data[i].studentId
          }
        })
        .then(student => {
          students.push({
            studentId: student.id,
            name: student.last_name
          });
          if (i == dataCount - 1) {
            sendResponse(res, students)
          }
        })
      }
    })
  })
    
    .catch(err => {
      res.status(500).send({ message: err });
    });
  }
};

function sendResponse(res, students) {
  if (students){
    res.status(200).send({ students });
  }
}