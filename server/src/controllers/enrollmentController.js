const prisma = require("../config/prismaClient");

const enroll = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.body;

  try {
    const course = await prisma.course.findFirst({
      where: { id: courseId, published: true },
    });

    if (!course) {
      return res.status(404).json({ error: "Curso no disponible" });
    }

    const existing = await prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "Ya estás inscripto en este curso" });
    }

    const activeCount = await prisma.enrollment.count({
      where: {
        userId,
        completed: false,
      },
    });

    if (activeCount >= 3) {
      return res.status(400).json({
        error: "Máximo de 3 cursos activos alcanzado",
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        completed: false,
      },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: "Error al inscribirse" });
  }
};

const myEnrollments = async (req, res) => {
  const userId = req.user.id;

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: { category: true },
        },
      },
    });

    res.json(enrollments);
  } catch {
    res.status(500).json({ error: "Error al obtener inscripciones" });
  }
};

const complete = async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
    });

    if (!enrollment || enrollment.userId !== userId) {
      return res.status(404).json({ error: "Inscripción no encontrada" });
    }

    const updated = await prisma.enrollment.update({
      where: { id },
      data: { completed: true },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Error al completar curso" });
  }
};

const remove = async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
    });

    if (!enrollment || enrollment.userId !== userId) {
      return res.status(404).json({ error: "Inscripción no encontrada" });
    }

    await prisma.enrollment.delete({
      where: { id },
    });

    res.json({ message: "Inscripción cancelada" });
  } catch {
    res.status(500).json({ error: "Error al cancelar inscripción" });
  }
};

module.exports = {
  enroll,
  myEnrollments,
  complete,
  remove,
};
