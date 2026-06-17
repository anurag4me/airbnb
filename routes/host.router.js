const router = require("express").Router();
const path = require("path");
const upload = require("../middlewares/upload.js");
const hostController = require("../controllers/host.controller.js");

router
  .get("/add-home", hostController.getAddHome)
  .post("/add-home", upload.fields([
      { name: 'photo', maxCount: 1 },
      { name: 'rule', maxCount: 1 },
    ]), hostController.postAddHome)
  .get("/home-list", hostController.getHostHomes)
  .get("/edit-home/:homeId", hostController.getEditHome)
  .post("/edit-home", upload.fields([
      { name: 'photo', maxCount: 1 },
      { name: 'rule', maxCount: 1 },
    ]), hostController.postEditHome)
  .post("/delete-home/:homeId", hostController.postDeleteHome)

module.exports = router;
