const Post = require("../models/Post");
const User = require("../models/User");
const mongoose = require("mongoose");

const createPost = async (req, res) => {
  try {
    const { caption, imageUrl, location, tags } = req.body;

    // Ensure the request contains the user ID
    if (!req.user) {
      return res.status(400).json({ message: "User is required" });
    }

    // Create a new post
    const newPost = new Post({
      creator: req.user, // Assuming req.user contains the user object
      caption,
      imageUrl,
      location,
      tags,
    });

    // Save the new post to the database
    await newPost.save();

    // Send a success response
    res.status(201).json(newPost);
  } catch (error) {
    // Send an error response
    res.status(400).json({ message: error.message });
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { caption, location, tags, imageUrl } = req.body;
    const updateData = { caption, location };

    if (tags) {
      updateData.tags = tags;
    }

    updateData.imageUrl = imageUrl;

    console.log(updateData);
    const post = await Post.findByIdAndUpdate(id, updateData, { new: true });

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

// Get a post by ID
const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate("creator");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("creator").populate({
      path: "likes.",
      select: "userId profilePicture", // Select only userId and profilePicture
    });
    // .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

async function updateLikes(req, res) {
  let { postId, likesArray } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).send("Invalid postId");
  }

  // Remove null values and invalid ObjectIds from likesArray
  likesArray = likesArray.filter(
    (id) => id !== null && mongoose.Types.ObjectId.isValid(id)
  );

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update the post's likes
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $set: { likes: likesArray } },
        { new: true, session }
      );

      if (!updatedPost) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).send("Post not found");
      }

      // Iterate over likesArray and update each user
      for (const userId of likesArray) {
        await User.findByIdAndUpdate(
          userId,
          { $addToSet: { likedPosts: postId } },
          { session }
        );
      }

      // Remove postId from likedPosts of users who unliked the post
      await User.updateMany(
        {
          _id: { $nin: likesArray },
          likedPosts: postId,
        },
        {
          $pull: { likedPosts: postId },
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json(updatedPost);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  getAllPosts,
  updateLikes,
};
