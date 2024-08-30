const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  location: String,
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Saves",
  }],
}, {
  timestamps: true,
});

postSchema.pre('save', async function(next) {
  if (this.isNew) {  // Only run this for newly created documents
    const User = mongoose.model('User');
    try {
      await User.findByIdAndUpdate(
        this.creator,
        { $addToSet: { posts: this._id } },
        { new: true, useFindAndModify: false }
      );
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("Post", postSchema);
