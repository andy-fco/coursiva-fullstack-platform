const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/authMiddleware");
const { categorySchema } = require("../validators/categoryValidator");
const controller = require("../controllers/categoryController");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

router.post("/", auth, isAdmin, (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  controller.create(req, res);
});

router.put("/:id", auth, isAdmin, (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  controller.update(req, res);
});

router.delete("/:id", auth, isAdmin, controller.remove);

module.exports = router;
