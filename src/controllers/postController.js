const fs = require("fs");
const { StatusCodes: SC } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const {
  ERROR_MESSAGES: ERR,
  MISCELLANEOUS: MISC,
  RESPONSE_MESSAGES: RES,
  SELECT_FIELDS: SF,
} = require("../constants");
const { BadRequestError, NotFoundError } = require("../errors");
const { Post, User } = require("../models");

const getAllPosts = async (req, res, next) => {
  const allPosts = await Post.find({}).select(SF.EXC.VERSION);
  res.status(SC.OK).json({ posts: allPosts, count: allPosts.length });
};

const getPost = async (req, res, next) => {
  const { id } = req.params;

  const existingPost = await Post.findById(id).select(SF.EXC.VERSION);
  if (!existingPost) {
    throw new NotFoundError(ERR.POST_NOT_FOUND);
  }

  res.status(SC.OK).json({ post: existingPost });
};

const createPost = async (req, res, next) => {
  const {
    user: { id: author },
    body: { title, content, tags },
  } = req;

  const existingPost = await Post.findOne({ title, content });
  if (existingPost) {
    throw new BadRequestError(ERR.POST_ALREADY_EXISTS);
  }

  const createdPost = await Post.create({ title, content, tags, author });
  await User.findByIdAndUpdate(author, { $push: { posts: createdPost._id } });
  const post = createdPost.toObject();
  delete post["__v"];

  res.status(SC.CREATED).json({ post });
};

const updatePost = async (req, res, next) => {
  const {
    params: { id },
    body: { title, content, tags },
  } = req;

  const existingPost = await Post.findById(id);
  if (!existingPost) {
    throw new NotFoundError(ERR.POST_NOT_FOUND);
  }

  const options = { new: true, runValidators: true };
  const update = {
    title: title || existingPost.title,
    content: content || existingPost.content,
    tags: tags || existingPost.tags,
  };

  await existingPost.updateOne(update, options);
  const optimisticUpdatedPost = { ...existingPost["_doc"], ...update };
  delete optimisticUpdatedPost["__v"];

  res.json({ post: optimisticUpdatedPost });
};

const updateLikes = async (req, res, next) => {
  const {
    params: { id: postId },
    user: { id: userId },
  } = req;

  const existingPost = await Post.findById(postId);
  if (!existingPost) {
    throw new NotFoundError(ERR.POST_NOT_FOUND);
  }

  const options = { new: true, runValidators: true };
  const update = { likes: existingPost.likes?.slice() };
  const isAlreadyLikedByUser = existingPost.likes.includes(userId);
  const notAlreadyLikedByUser = !isAlreadyLikedByUser;

  if (notAlreadyLikedByUser) {
    update.likes.push(userId);
  }

  if (isAlreadyLikedByUser) {
    update.likes = update.likes.filter((id) => id.toString() !== userId);
  }

  await existingPost.updateOne(update, options);
  const optimisticUpdatedPost = { ...existingPost["_doc"], ...update };

  res.status(SC.OK).json({ count: optimisticUpdatedPost.likes.length });
};

const deletePost = async (req, res, next) => {
  const { id } = req.params;

  const existingPost = await Post.findOneAndDelete({ _id: id });
  if (!existingPost) {
    throw new NotFoundError(ERR.POST_NOT_FOUND);
  }
  await User.findByIdAndUpdate(existingPost.author, { $pull: { posts: id } });

  res.status(SC.OK).json({ message: RES.POST_DELETED });
};

const uploadPostImages = async (req, res, next) => {
  const { id } = req.params;

  // Check for uploaded files
  if (!req.files || !req.files.postImages) {
    throw new BadRequestError(ERR.NO_FILE_UPLOADED);
  }

  // Ensure postImages is an array
  const postImages = Array.isArray(req.files.postImages) 
    ? req.files.postImages 
    : [req.files.postImages];

  // Validate file types
  postImages.forEach((file) => {
    const { mimetype } = file;
    if (!mimetype.startsWith("image/")) {
      throw new BadRequestError(ERR.IMAGE_REQUIRED);
    }
  });

  // Validate file sizes
  const sizeLimit = MISC.ONE_MB;
  const errorMessage = ERR.FILE_TOO_LARGE + sizeLimit / MISC.ONE_MB + "MB";
  postImages.forEach((file) => {
    if (file.size > sizeLimit) {
      throw new BadRequestError(errorMessage);
    }
  });

  const existingPost = await Post.findById(id);
  // Check for maximum number of images
  if (existingPost.imagesUrl.length + postImages.length > 5) {
    throw new BadRequestError(ERR.MAX_FILES_EXCEEDED);
  }

  // Ensure the directory exists
  if (!fs.existsSync(MISC.POSTS_DIR)) {
    fs.mkdirSync(MISC.POSTS_DIR, { recursive: true });
  }

  // Upload images and update post
  await Promise.all(
    postImages.map(async (file) => {
      const targetPath = `${MISC.POSTS_DIR}${file.name}`;
      await file.mv(targetPath);
      const result = await cloudinary.uploader.upload(targetPath, {
        use_filename: false,
        folder: "posts",
      });
      fs.unlinkSync(targetPath);
      await existingPost.updateOne(
        { $push: { imagesUrl: result.secure_url } },
        { new: true, runValidators: true }
      );
    })
  );

  const updatedPost = await Post.findById(id);
  res.status(SC.OK).json({ imagesUrl: updatedPost.imagesUrl });
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  updateLikes,
  deletePost,
  uploadPostImages,
};