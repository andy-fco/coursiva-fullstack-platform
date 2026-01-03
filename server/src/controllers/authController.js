const prisma = require("../config/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
      },
    });

    return res.json({
      message: "Usuario registrado",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = { register, login };
