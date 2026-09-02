import express from "express";
import Post from "../models/Post.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const shapePost = (post) => ({
  id: post._id,
  author: post.author,
  text: post.text,
  image: post.image,
  likes: post.likes,
  comments: post.comments,
  likesCount: post.likes.length,
  commentsCount: post.comments.length,
  createdAt: post.createdAt
});

router.get("/", async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 30);
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Post.countDocuments()
  ]);

  res.json({
    posts: posts.map(shapePost),
    page,
    totalPages: Math.ceil(total / limit) || 1,
    total
  });
});

router.post("/", requireAuth, async (req, res) => {
  const text = req.body.text?.trim() || "";
  const image = req.body.image?.trim() || "";

  if (!text && !image) {
    return res.status(400).json({ message: "Add text, an image, or both before posting" });
  }

  const post = await Post.create({
    author: {
      user: req.user._id,
      username: req.user.username
    },
    text,
    image
  });

  res.status(201).json(shapePost(post));
});

router.post("/:id/like", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const existingLike = post.likes.find((like) => like.user.equals(req.user._id));

  if (existingLike) {
    post.likes = post.likes.filter((like) => !like.user.equals(req.user._id));
  } else {
    post.likes.push({
      user: req.user._id,
      username: req.user.username
    });
  }

  await post.save();
  res.json(shapePost(post));
});

router.post("/:id/comments", requireAuth, async (req, res) => {
  const text = req.body.text?.trim();

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  post.comments.push({
    user: req.user._id,
    username: req.user.username,
    text
  });

  await post.save();
  res.status(201).json(shapePost(post));
});
router.delete("/:id", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  // Check if logged-in user is the author
  if (post.author.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "You can only delete your own posts",
    });
  }

  await Post.findByIdAndDelete(req.params.id);

  res.json({
    message: "Post deleted successfully",
  });
});

export default router;
