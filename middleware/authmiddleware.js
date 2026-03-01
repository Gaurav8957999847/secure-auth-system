import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // checking if the header exist 
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // extracting the token 
      token = req.headers.authorization.split(" ")[1];
    }

    // if token does not exist then block
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // finding the user by the id 
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token failed" });
  }
};
