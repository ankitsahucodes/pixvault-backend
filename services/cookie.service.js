function setSecureCookie(res, userId) {
  res.cookie("userId", userId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return res;
}

module.exports = { setSecureCookie };