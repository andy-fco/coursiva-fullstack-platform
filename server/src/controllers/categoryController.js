const prisma = require("../config/prismaClient");

const getAll = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener categorías" });
  }
};

const getById = async (req, res) => {
  const id = Number(req.params.id);

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return res.status(404).json({ error: "Categoría no encontrada" });
  }

  res.json(category);
};

const create = async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: req.body,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Error al crear categoría" });
  }
};

const update = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const category = await prisma.category.update({
      where: { id },
      data: req.body,
    });
    res.json(category);
  } catch (error) {
    res.status(404).json({ error: "Categoría no encontrada" });
  }
};

const remove = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.category.delete({ where: { id } });
    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    res.status(404).json({ error: "Categoría no encontrada" });
  }
};

module.exports = { getAll, create, update, remove, getById };
