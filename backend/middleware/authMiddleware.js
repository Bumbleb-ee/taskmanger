const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Check Authorization header exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2️⃣ Extract token
      token = req.headers.authorization.split(" ")[1];

      // 3️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4️⃣ Get user from DB (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      // 5️⃣ Allow request to continue
      next();

    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // 6️⃣ No token provided
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

module.exports = { protect };