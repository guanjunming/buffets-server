const { body, param } = require("express-validator");

const validateIdInBody = [body("id", "id is invalid").notEmpty().isMongoId()];

const validateIdInParam = [param("id", "id is invalid").notEmpty().isMongoId()];

module.exports = { validateIdInBody, validateIdInParam };
