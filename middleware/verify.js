const jwt = require("jsonwebtoken");


function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("login");

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET
    );
    req.user = data;
    next();
  } catch (err) {
    return res.redirect("login");
  }
}

module.exports = isLoggedIn;