const { authJwt } = require("../middleware");
const controllerClass = require("../controllers/class.controller");
const controllerClassList = require("../controllers/students.controller");
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
    [authJwt.verifyToken],
    controllerClass.createGroup
  );
  app.post("/api/add/student", [authJwt.verifyToken], controllerClassList.addStudents);
  app.post("/api/get/studentsFromClass", [authJwt.verifyToken], controllerClassList.getStudentsFromClass);
};