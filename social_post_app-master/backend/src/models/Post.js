import mongoose from "mongoose";

const userSnapshotSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    username: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    }
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: userSnapshotSchema,
      required: true
    },
    text: {
      type: String,
      trim: true,
      maxlength: 800
    },
    image: {
      type: String,
      trim: true
    },
    likes: {
      type: [userSnapshotSchema],
      default: []
    },
    comments: {
      type: [commentSchema],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
