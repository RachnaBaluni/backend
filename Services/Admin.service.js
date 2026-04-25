const loginAdmin = (email, password) => {
  const adminEmail = process.env.ADMIN_LOGIN_USERNAME;
  const adminPassword = process.env.ADMIN_LOGIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    return { success: true, message: "Admin logged in successfully" };
  } else {
    throw new Error("Invalid credentials");
  }
};

module.exports = {
  loginAdmin,
};
