//VALIDATION
const Joi = require("joi");

const registerValidation = (data) => {
  //REGISTER VALIDATION
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
    //LOGIN VALIDATION
    const schema = Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().min(8).required(),
    });
    return schema.validate(data);
  };

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
