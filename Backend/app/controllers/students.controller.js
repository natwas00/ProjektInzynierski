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
        
        for (i in req.body.students) {
          studentLogin = req.body.students[i]
          findStudent(studentLogin, i, req.body.students.length, req.body.classId, res)
        } 
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
      });
};

function findStudent(studentLogin, loopCount, studentCount, classId, res) {
  console.log(loopCount, " ", studentCount)
  students = []
  noStudentsFoundArray = []
  Users.findOne({
    where: {
      login: studentLogin
  }
  }).then(student => {
    
    if (!student) {
      noStudentsFoundArray.push(studentLogin)
    } else {
      students.push(student.id)
    }
    if (loopCount == studentCount - 1) {
      addStudents(students, noStudentsFoundArray, classId, res)
    }
  })
}
function addStudents(studentIDs, noStudentsFoundArray, classId, res) {
  existingUser = []
  checkedStudentIds = []
  for (i in studentIDs) {
    ClassList.findOne({
      where: {
        studentId: studentIDs[i]
      }
    }).then(student => {
      if (student) {
        checkedStudentIds.push(student.studentId)
      }
      if (i == studentIDs.length - 1) {
        if (studentIDs.length > 0) {
          array_with_data=[]
          for (i in studentIDs){
            if (checkedStudentIds.includes(studentIDs[i])) {
              existingUser.push(studentIDs[i])
            } else {
              array_with_data.push({
                classId: classId,
                studentId: studentIDs[i]
              })
            }
          }
          if (array_with_data){
            ClassList.bulkCreate(
              array_with_data
            ).then(data=>{
              existingStudentsNames = []
              msg = "Students added." 
                if (existingUser.length > 0) {
                  for (i in existingUser) {
                    Users.findOne({
                      where: {
                        id: existingUser[i]
                    }
                    }).then(student => {
                      if (student) {
                        existingStudentsNames.push(student.login)
                      }
                      if (i == existingUser.length - 1) {
                        res.status(200).send({ message: msg, userNotFound: noStudentsFoundArray, userInClassAlready: existingStudentsNames});
                      }
                    })
                  }
                }
            })
          } 
        }
      }
    })
  }
}



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