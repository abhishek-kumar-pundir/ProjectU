import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/generateToken.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookie.js";

const PAIRING_CODE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// never hand back password/pairing internals in an API response
const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  partnerId: user.partnerId,
});

// REGISTER
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: "Username, email and password are required" });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    // deliberately generic — don't confirm which emails are already registered
    return res.status(400).json({ message: "Could not create an account with those details" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: username.trim(),
    email: normalizedEmail,
    password: hashed,
  });

  setAuthCookie(res, generateToken(user._id));
  res.json(sanitizeUser(user));
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  // Same generic message whether the email doesn't exist or the password is
  // wrong. Returning different messages ("user not found" vs "wrong
  // password") lets an attacker enumerate registered emails — this closes
  // that off.
  const invalidMessage = "Invalid email or password";

  if (!user) return res.status(400).json({ message: invalidMessage });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: invalidMessage });

  setAuthCookie(res, generateToken(user._id));
  res.json(sanitizeUser(user));
};

// LOGOUT
export const logout = async (req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
};

// ME
export const getMe = async (req, res) => {
  res.json(sanitizeUser(req.user));
};

// GET PARTNER — always and only this user's own linked partner, never
// "whoever else is in the DB" (that was the old two-person-only bug).
export const getPartner = async (req, res) => {
  if (!req.user.partnerId) return res.json(null);

  const partner = await User.findById(req.user.partnerId).select(
    "-password -pairingCode -pairingCodeExpires"
  );
  res.json(partner);
};

// GENERATE INVITE CODE — short-lived code the user shares with their partner
export const generateInviteCode = async (req, res) => {
  if (req.user.partnerId) {
    return res.status(400).json({ message: "You're already paired with someone" });
  }

  const code = crypto.randomBytes(4).toString("hex").toUpperCase(); // e.g. "A1B2C3D4"

  req.user.pairingCode = code;
  req.user.pairingCodeExpires = new Date(Date.now() + PAIRING_CODE_TTL_MS);
  await req.user.save();

  res.json({ code, expiresAt: req.user.pairingCodeExpires });
};

// REDEEM INVITE CODE — links the current user with whoever generated the code.
// This is the only way a partnerId ever gets set, so pairs are always formed
// by explicit, two-sided consent (both people had to act) rather than by
// the server just grabbing "the other user in the DB".
export const redeemInviteCode = async (req, res) => {
  if (req.user.partnerId) {
    return res.status(400).json({ message: "You're already paired with someone" });
  }

  const { code } = req.body;
  if (!code?.trim()) {
    return res.status(400).json({ message: "Enter a code" });
  }

  const inviter = await User.findOne({ pairingCode: code.trim().toUpperCase() });

  if (!inviter || !inviter.pairingCodeExpires || inviter.pairingCodeExpires < new Date()) {
    return res.status(400).json({ message: "That code is invalid or expired" });
  }

  if (inviter._id.equals(req.user._id)) {
    return res.status(400).json({ message: "You can't pair with yourself" });
  }

  if (inviter.partnerId) {
    return res.status(400).json({ message: "That code has already been used" });
  }

  inviter.partnerId = req.user._id;
  inviter.pairingCode = null;
  inviter.pairingCodeExpires = null;

  req.user.partnerId = inviter._id;
  req.user.pairingCode = null;
  req.user.pairingCodeExpires = null;

  await Promise.all([inviter.save(), req.user.save()]);

  res.json(sanitizeUser(req.user));
};
