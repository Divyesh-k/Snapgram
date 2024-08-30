const mongoose = require("mongoose");
const { Schema } = mongoose;

const StorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video"], required: true },
  postedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// Index to automatically delete expired stories
StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Add a post-save middleware
StorySchema.post("save", async function (doc) {
  try {
    const User = mongoose.model("User");
    await User.findByIdAndUpdate(
      doc.user,
      { $addToSet: { stories: doc._id } },
      { new: true, useFindAndModify: false }
    );
  } catch (error) {
    console.error("Error updating user with story reference:", error);
  }
});

// Add a pre-remove middleware
StorySchema.pre("remove", async function (next) {
  try {
    const User = mongoose.model("User");
    await User.findByIdAndUpdate(
      this.user,
      { $pull: { stories: this._id } },
      { new: true, useFindAndModify: false }
    );
    next();
  } catch (error) {
    console.error("Error removing story reference from user:", error);
    next(error);
  }
});

exports.Story = mongoose.model("Story", StorySchema);
