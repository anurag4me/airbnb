const router = require("express").Router()
const authController = require("../controllers/auth.controller")

router
    .get("/login", authController.getLogin)
    .get("/signup", authController.getSignup)
    .post("/signup", authController.postSignup)
    .post("/login", authController.postLogin)
    .post("/logout", authController.postLogout)

module.exports = router;