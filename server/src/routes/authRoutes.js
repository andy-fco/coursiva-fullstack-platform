const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { registerSchema, loginSchema } = require("../validators/authValidator");

router.post("/register", async (req, res) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return register(req, res);
});

router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return login(req, res);
});

module.exports = router;
