const { body } = require("express-validator");

const validateIdInBody = [body("id", "id is invalid").notEmpty().isMongoId()];

module.exports = {
  validateIdInBody,
};
