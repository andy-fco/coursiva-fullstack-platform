const Joi = require("joi");

const createCourseSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  durationHours: Joi.number().integer().min(1).required(),
  categoryId: Joi.number().integer().required(),
});

const updateCourseSchema = Joi.object({
  title: Joi.string().min(3).optional(),
  description: Joi.string().min(10).optional(),
  durationHours: Joi.number().integer().min(1).optional(),
  categoryId: Joi.number().integer().optional(),
  published: Joi.boolean().optional(),
}).min(1);

module.exports = {
  createCourseSchema,
  updateCourseSchema,
};
