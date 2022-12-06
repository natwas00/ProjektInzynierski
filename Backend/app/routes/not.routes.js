const { verifyNor,authJwt } = require("../middleware");
const controller = require("../controllers/notfication.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/read_not/:id", [authJwt.verifyToken, verifyNor.check_owner], controller.read_notification);
  app.get("/api/all_not",[authJwt.verifyToken],controller.show_notification)
  app.delete("/api/delete_not/:id", [authJwt.verifyToken, verifyNor.check_owner], controller.delete_notification)
};