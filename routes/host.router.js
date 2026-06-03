const router = require("express").Router();
const path = require("path");
const rootDir = require("../utils/pathUtil");
const hostController = require("../controllers/host.controller.js");

router
  .get("/add-home", hostController.getAddHome)
  .post("/add-home", hostController.postAddHome)
  .get("/home-list", hostController.getHostHomes)
  .get("/edit-home/:homeId", hostController.getEditHome)
  .post("/edit-home", hostController.postEditHome)
  .post("/delete-home/:homeId", hostController.postDeleteHome)

module.exports = router;
