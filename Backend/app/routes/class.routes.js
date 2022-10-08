const { authJwt, checkClassOwner } = require("../middleware");
const controllerClass = require("../controllers/class.controller");
const controllerClassList = require("../controllers/students.controller");
const { checkClassOwner2 } = require("../middleware/verifyTeacher");
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
    [authJwt.verifyToken, authJwt.isTeacher],
    controllerClass.createGroup
  );
  app.post("/api/add/student", [authJwt.verifyToken, checkClassOwner.checkClassOwner], controllerClassList.addStudents);
  app.get("/api/get/studentsFromClass/:classId", [authJwt.verifyToken, checkClassOwner.checkClassOwner], controllerClassList.getStudentsFromClass);
  app.delete('/api/delete_class/:classId', [authJwt.verifyToken, checkClassOwner.checkClassOwner2], controllerClass.delete_class);
  app.get('/api/classes/', [authJwt.verifyToken, authJwt.isTeacher],controllerClass.class_list);
  app.get('/api/class_sets/:classId',[authJwt.verifyToken], controllerClass.class_sets);
  app.get('/api/class_info/:classId',[authJwt.verifyToken],controllerClass.class_info)
};