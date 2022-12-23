const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const controller2 = require("../controllers/auth.controller");
const { verifySignUp } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("/api/test/all", controller.allAccess);
  app.get(
    "/api/test/user",
    [authJwt.verifyToken, authJwt.isUser],
    controller.userBoard
  );
  app.get(
    "/api/test/teacher",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.teacherBoard
  );
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.put(
    "/api/test/update",
    [authJwt.verifyToken, verifySignUp.check_update_password],
    controller2.updateData

  )
  app.delete(
    "/api/test/delete",
    [authJwt.verifyToken],
    controller2.deleteUser
  )
  
};