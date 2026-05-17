const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const PixVault_User = require("../models/user.model");

router.get("/google", (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:${process.env.PORT}/auth/google/callback&response_type=code&scope=profile email`;

  res.redirect(googleAuthUrl);
});

router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("Authorization code not provided");
  }

  let accessToken;

  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: `http://localhost:${process.env.PORT}/auth/google/callback`,
        grant_type: "authorization_code",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    accessToken = tokenResponse.data.access_token;
    // res.cookie("access_token", accessToken);

    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const user = userRes.data;

    const { id, email, name } = userRes.data;

    // 1. Check if user already exists
    let dbUser = await PixVault_User.findOne({ googleId: id });

    // 2. If not, create new user
    if (!dbUser) {
      dbUser = await PixVault_User.create({
        googleId: id,
        email,
        name,
      });
    }

    // 3. Print user from DB
    console.log("DB User:", dbUser);

    // setSecureCookie(res, dbUser._id);

    const token = jwt.sign({ userId: dbUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    // 4. Send simple response
    // res.send("Login success! Check your terminal.");

    return res.redirect(`${process.env.FRONTEND_URL}`);
  } catch (error) {
    console.error(
      "Error exchanging authorization code for access token:",
      error,
    );
    return res
      .status(500)
      .send("Failed to exchange authorization code for access token");
  }
});

const { verifyUser } = require("../middleware/auth.middleware");

router.get("/me", verifyUser, async (req, res) => {
  try {
    const user = await PixVault_User.findById(req.user.userId)
      .select("name email");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = router;
