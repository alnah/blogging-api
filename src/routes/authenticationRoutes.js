const router = require("express").Router();
const {
  signUp,
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers");
const { authenticateUser } = require("../middlewares");

router.route("/sign-up").post(signUp);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(login);
router.route("/logout").delete(authenticateUser, logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

module.exports = router;
