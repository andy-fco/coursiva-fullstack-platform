const Joi = require("joi");

const enrollSchema = Joi.object({
  courseId: Joi.number().integer().required(),
});

module.exports = { enrollSchema };
