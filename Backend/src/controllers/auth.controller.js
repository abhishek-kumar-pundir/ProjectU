import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// REGISTER
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashed
  });

  res.json({
    _id: user._id,
    username: user.username,
    token: generateToken(user._id)
  });
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    _id: user._id,
    username: user.username,
    token: generateToken(user._id)
  });
};

// ADD this to your existing auth controller
export const getMe = async (req, res) => {
  const user = await User.findById(req.user).select("-password");
  res.json(user);
};

// ADD a route to get the other user (so chatbox knows who to chat with)
export const getOtherUser = async (req, res) => {
  // returns the only other user in the DB (since it's just 2 people)
  const other = await User.findOne({ _id: { $ne: req.user } }).select("-password");
  res.json(other);
};