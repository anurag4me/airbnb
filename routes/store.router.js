const router = require("express").Router();
const path = require("path");
const storeController = require("../controllers/store.controller.js");

router
  .get("/", storeController.getIndex)
  .get("/homes", storeController.getHomes)
  .get("/bookings", storeController.getBookings)
  .get("/favourites", storeController.getFavouriteList)
  .post("/favourites", storeController.postAddToFavourite)
  .get("/homes/:homeId", storeController.getHomeDetails)
  .post("/delete-favourite/:homeId", storeController.postRemoveFromFavourite)
  .get("/rules/:homeId", storeController.getHomeRules)

module.exports = router;
