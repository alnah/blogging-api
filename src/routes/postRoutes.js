const router = require("express").Router();
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  updateLikes,
  deletePost,
  uploadPostImages,
} = require("../controllers");
const { authenticateUser, authorizeRoles } = require("../middlewares");

router.get("/", authenticateUser, authorizeRoles(["admin"]), getAllPosts);
router.post("/", authenticateUser, createPost);
router.get("/:id", authenticateUser, getPost);
router.patch("/:id", authenticateUser, updatePost);
router.delete("/:id", authenticateUser, deletePost);
router.patch("/:id/likes", authenticateUser, updateLikes);
router.patch("/:id/images", authenticateUser, uploadPostImages);

module.exports = router;
