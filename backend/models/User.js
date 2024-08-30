const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  profilePicture: { type: String, default: "default_profile.png" },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  saves: [{ type: Schema.Types.ObjectId, ref: "Saves" }],
  stories: [{ type: Schema.Types.ObjectId, ref: "Story" }], // Added reference to UserStory
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

