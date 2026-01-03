const prisma = require("../config/prismaClient");

const getAllPublic = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      include: { category: true },
    });
    res.json(courses);
  } catch {
    res.status(500).json({ error: "Error al obtener cursos" });
  }
};

const getByIdPublic = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const course = await prisma.course.findFirst({
      where: { id, published: true },
      include: { category: true },
    });

    if (!course) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json(course);
  } catch {
    res.status(500).json({ error: "Error al obtener curso" });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { category: true },
    });
    res.json(courses);
  } catch {
    res.status(500).json({ error: "Error al obtener cursos" });
  }
};

const getByIdAdmin = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!course) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json(course);
  } catch {
    res.status(500).json({ error: "Error al obtener curso" });
  }
};

const create = async (req, res) => {
  try {
    const course = await prisma.course.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        durationHours: req.body.durationHours,
        categoryId: req.body.categoryId,
        published: false,
      },
    });

    res.status(201).json(course);
  } catch {
    res.status(400).json({ error: "Error al crear curso" });
  }
};

const update = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const course = await prisma.course.update({
      where: { id },
      data: req.body,
    });

    res.json(course);
  } catch {
    res.status(404).json({ error: "Curso no encontrado" });
  }
};

const remove = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.course.delete({ where: { id } });
    res.json({ message: "Curso eliminado" });
  } catch {
    res.status(404).json({ error: "Curso no encontrado" });
  }
};

module.exports = {
  getAllPublic,
  getByIdPublic,
  getAllAdmin,
  getByIdAdmin,
  create,
  update,
  remove,
};
