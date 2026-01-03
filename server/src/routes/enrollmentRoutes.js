const express = require("express");
const router = express.Router();
const controller = require("../controllers/enrollmentController");
const { auth } = require("../middlewares/authMiddleware");
const { enrollSchema } = require("../validators/enrollmentValidator");

router.post("/", auth, (req, res) => {
  const { error } = enrollSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  controller.enroll(req, res);
});

router.get("/me", auth, controller.myEnrollments);
router.patch("/:id/complete", auth, controller.complete);
router.delete("/:id", auth, controller.remove);

module.exports = router;
