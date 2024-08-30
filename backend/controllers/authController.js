const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  console.log("params::" , username , email , password);

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log("hashed password : ", hashedPassword);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with the token and user details
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    // Log the error to the console
    console.error("Error during registration:", err);

    // Respond with an error message
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ token, user: existingUser });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    let currentUser = await User.findById(req.user)
      .populate("posts")
      .populate("likedPosts")
      .populate("saves")
      .populate("followers")
      .populate("following")
      .populate("stories");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // console.log('User before population:', JSON.stringify(currentUser, null, 2));

    // Check if posts exist but aren't populated
    if (
      currentUser.posts.length > 0 &&
      typeof currentUser.posts[0] !== "object"
    ) {
      // console.log('Posts exist but are not populated');
      await currentUser.populate("posts");
    }

    // Check if likedPosts exist but aren't populated
    if (
      currentUser.likedPosts.length > 0 &&
      typeof currentUser.likedPosts[0] !== "object"
    ) {
      // console.log('Liked posts exist but are not populated');
      await currentUser.populate("likedPosts");
    }

    // console.log('User after population:', JSON.stringify(currentUser, null, 2));

    res.json(currentUser);
  } catch (err) {
    console.error("Error fetching current user:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { register, login, getCurrentUser };
