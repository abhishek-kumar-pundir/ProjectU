import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  // token now lives in an httpOnly cookie (set on login/register), so it's
  // never exposed to client-side JS. Bearer header kept as a fallback for
  // API testing tools like Postman.
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

// Use after `protect` on any route that requires an active partner pairing
// (chat, mood, links, listen-together) so an unpaired user gets a clear
// 403 instead of the request crashing or silently touching no one's data.
export const requirePartner = (req, res, next) => {
  if (!req.user.partnerId) {
    return res.status(403).json({ message: "Pair with your partner first" });
  }
  next();
};
