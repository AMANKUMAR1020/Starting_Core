const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.route("/login").post(usersController.login);
router.route("/register").post(usersController.register);
router.route("/editProfile").put(usersController.updateProfile);
router.route("/logout").get(usersController.logout);

module.exports = router;
