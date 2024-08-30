const mongoose = require('mongoose');

const savesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  savedAt: { type: Date, default: Date.now },
});


// Add a post-save hook
savesSchema.post('save', async function(doc) {
  await mongoose.model('User').findByIdAndUpdate(
    doc.user,
    { $addToSet: { saves: doc._id } }
  );
});

// Add a post-remove hook
savesSchema.post('remove', async function(doc) {
  await mongoose.model('User').findByIdAndUpdate(
    doc.user,
    { $pull: { saves: doc._id } }
  );
});

const Saves = mongoose.model('Saves', savesSchema);

module.exports = Saves;