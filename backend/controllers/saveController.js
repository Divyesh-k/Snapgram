// controllers/saveController.js

const Saves = require("../models/Saves");

savePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    // Check if the post is already saved by the user
    const existingSave = await Saves.findOne({ user: userId, post: postId });
    if (existingSave) {
      return res.status(400).json({ message: "Post already saved." });
    }

    // Save the post
    const newSave = new Saves({
      user: userId,
      post: postId,
    });

    await newSave.save();
    res
      .status(201)
      .json({ message: "Post saved successfully.", save: newSave });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save post.", error: error.message });
  }
};

const deleteSavedPost = async (req, res) => {
  const { saveId } = req.params;
  const userId = req.user; // Assuming you have middleware that sets req.user to the current user's ID

  try {
    // Find and delete the save
    const deletedSave = await Saves.findOneAndDelete({
      _id: saveId,
      user: userId,
    });

    if (!deletedSave) {
      return res
        .status(404)
        .json({
          message: "Save not found or you do not have permission to delete it",
        });
    }

    res.json({ message: "Save deleted successfully" });
  } catch (error) {
    console.error("Error deleting saved post:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { deleteSavedPost, savePost };
