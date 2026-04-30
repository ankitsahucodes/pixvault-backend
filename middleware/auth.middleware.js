const PixVault_User = require("../models/user.model");

const verifyUser = async (req, res, next) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const user = await PixVault_User.findById(userId);

  if (!user) {
    return res.status(401).json({ error: "Invalid user" });
  }

  req.user = user;
  next();
};

module.exports = { verifyUser };