const {
  signUp,
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
} = require("./authenticationController");

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
} = require("./userController");

const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  updateLikes,
  deletePost,
  uploadPostImages,
} = require("./postController");

module.exports = {
  // authenticationController
  signUp,
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
  // userController
  getAllUsers,
  getUser,
  showMyAccount,
  updateMyProfile,
  updateMyUsername,
  updateMyEmail,
  updateMyPassword,
  uploadMyAvatar,
  deleteMyAccount,
  // postController
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  updateLikes,
  deletePost,
  uploadPostImages,
};
