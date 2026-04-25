// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const MemberAcademy = require("../models/MemberAcademy.model");
const Coach = require("../models/MemberCoach.model");
const MemberDistrict = require("../models/MemberDistrict.model");
const MemberPlayer = require("../models/MemberPlayer.model");

/**
 * Middleware to authenticate requests by verifying JWT token from cookies
 * and fetching the corresponding user from the database.
 * Attaches the *actual user object* from the DB to req.user if valid.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function.
 */
const authenticateDB = async (req, res, next) => {
  let token;

  // 1. Check for token in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token provided." });
  }

  try {
    // 2. Verify JWT Signature and Decode Payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Expected decoded payload: { id: user._id, type: user.type, ... }
    const { id, type } = decoded;

    if (!id || !type) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload." });
    }

    // 3. Determine the Mongoose Model based on 'type' from the token
    let Model;
    switch (type) {
      case "Player":
        Model = MemberPlayer;
        break;
      case "Coach":
        Model = Coach;
        break;
      case "Academy":
        Model = MemberAcademy;
        break;
      case "District":
        Model = MemberDistrict;
        break;
      default:
        // If the type in the token is unknown/invalid
        return res
          .status(401)
          .json({ success: false, message: "Invalid user type in token." });
    }

    // 4. Fetch User from MongoDB
    // We fetch the user but exclude the password for security
    const user = await Model.findById(id).select("-password");

    if (!user) {
      // User not found in DB (e.g., account deleted)
      return res.status(401).json({
        success: false,
        message: "User associated with token not found.",
      });
    }

    // Optional: Add more checks here if needed (e.g., user is active/not banned)
    // if (user.isBanned) {
    //   return res.status(403).json({ success: false, message: "Your account has been suspended." });
    // }

    // 5. Attach the fetched user object and its type to the request
    req.user = user.toObject(); // Convert Mongoose document to plain object
    req.user.type = type; // Ensure the type is available on req.user

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error("Authentication DB middleware error:", error);

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please log in again.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token, please log in again.",
      });
    }

    // Generic error for other issues
    return res.status(500).json({
      success: false,
      message: "Authentication failed due to server error.",
    });
  }
};

const isAdmin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    email = decoded.email;
    password = decoded.password;
    if (
      email !== process.env.ADMIN_LOGIN_USERNAME &&
      password !== process.env.ADMIN_LOGIN_PASSWORD
    )
      throw Error;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = {
  authenticateDB,
  isAdmin,
};
