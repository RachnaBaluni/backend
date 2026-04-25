const jwt = require("jsonwebtoken");
const { loginAdmin } = require("../Services/Admin.service");

const adminLogin = (req, res) => {
  const { email, password } = req.body;
  try {
    const result = loginAdmin(email, password);
    if (result.success) {
      const token = jwt.sign({ email, password }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 1000 * 60 * 60,
      });
      res.status(200).json({ message: result.message });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  adminLogin,
};
