const express = require("express");
const router = express.Router();
const controller = require("../controllers/courseController");
const { auth, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCourseSchema,
  updateCourseSchema,
} = require("../validators/courseValidator");

router.get("/admin", auth, isAdmin, controller.getAllAdmin);
router.get("/admin/:id", auth, isAdmin, controller.getByIdAdmin);

router.post("/", auth, isAdmin, (req, res) => {
  const { error } = createCourseSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  controller.create(req, res);
});

router.put("/:id", auth, isAdmin, (req, res) => {
  const { error } = updateCourseSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  controller.update(req, res);
});

router.delete("/:id", auth, isAdmin, controller.remove);

router.get("/", controller.getAllPublic);
router.get("/:id", controller.getByIdPublic);

module.exports = router;
