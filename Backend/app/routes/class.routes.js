const { authJwt, checkClassOwner } = require("../middleware");
const controllerClass = require("../controllers/class.controller");
const controllerClassList = require("../controllers/students.controller");
const { checkClassOwner2 } = require("../middleware/verifyTeacher");
const verifyAccess = require("../middleware/verifyClassAccess");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/create/class",
    [authJwt.verifyToken, authJwt.isTeacher, checkClassOwner.check_fields, checkClassOwner.check_class_name],
    controllerClass.createGroup
  );
  app.post("/api/add/student", [authJwt.verifyToken, checkClassOwner.checkClassOwner], controllerClassList.addStudents);
  app.get("/api/get/studentsFromClass/:classId", [authJwt.verifyToken, checkClassOwner.checkClassOwner2], controllerClassList.getStudentsFromClass);
  app.delete('/api/delete_class/:classId', [authJwt.verifyToken, checkClassOwner.checkClassOwner2], controllerClass.delete_class);
  app.get('/api/classes/', [authJwt.verifyToken, authJwt.isTeacher],controllerClass.class_list);
  app.get('/api/class_sets/:classId',[authJwt.verifyToken, verifyAccess.checkAccess1], controllerClass.class_sets);
  app.get('/api/class_info/:classId',[authJwt.verifyToken, verifyAccess.checkAccess1],controllerClass.class_info);
  app.post("/api/classes/edit/:classId", [authJwt.verifyToken, checkClassOwner.checkClassOwner2], controllerClass.edit_class_info);
  app.delete("/api/delete/studentFromClass", [authJwt.verifyToken, checkClassOwner.checkClassOwner], controllerClassList.delete_student_from_class);
  app.get("/api/get/classesOfStudent", [authJwt.verifyToken, authJwt.isUser], controllerClassList.student_classes);
  app.get("/api/get/rating/:classId", [authJwt.verifyToken, verifyAccess.checkAccess1], controllerClass.class_rating);
  app.post("/api/create_task",[authJwt.verifyToken, checkClassOwner.checkClassOwner],controllerClass.add_class_task);
  app.get("/api/get_tasks/:classId",[authJwt.verifyToken, verifyAccess.checkAccess1], controllerClass.all_tasks)
  app.delete("/api/delete_task/:id",[authJwt.verifyToken, checkClassOwner.check_delete_task], controllerClass.delete_task)
  app.get("/api/get/statistics", [authJwt.verifyToken], controllerClassList.statistics);

};