const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "No autorizado" });

  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ error: "Se requieren permisos de administrador" });
  }

  next();
};

module.exports = { auth, isAdmin };
