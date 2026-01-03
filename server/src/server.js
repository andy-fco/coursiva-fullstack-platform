const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./config/prismaClient");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/categories", categoryRoutes);

const courseRoutes = require("./routes/courseRoutes");
app.use("/courses", courseRoutes);

const enrollmentRoutes = require("./routes/enrollmentRoutes");
app.use("/enrollments", enrollmentRoutes);

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Backend corriendo en http://localhost:${PORT}`)
);
