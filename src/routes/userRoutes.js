const router = require("express").Router();
const {
  getAllUsers,
  getUser,
  showMyAccount,
  updateMyProfile,
  updateMyUsername,
  updateMyEmail,
  updateMyPassword,
  uploadMyAvatar,
  deleteMyAccount,
} = require("../controllers");
const { authenticateUser, authorizeRoles } = require("../middlewares");

router.get("/", authenticateUser, authorizeRoles(["admin"]), getAllUsers);
router.get("/me/show", authenticateUser, showMyAccount);
router.patch("/me/update/profile", authenticateUser, updateMyProfile);
router.patch("/me/update/username", authenticateUser, updateMyUsername);
router.patch("/me/update/email", authenticateUser, updateMyEmail);
router.patch("/me/update/password", authenticateUser, updateMyPassword);
router.post("/me/upload/avatar", authenticateUser, uploadMyAvatar);
router.delete("/me/delete", authenticateUser, deleteMyAccount);
router.get("/:id", authenticateUser, getUser);

module.exports = router;
