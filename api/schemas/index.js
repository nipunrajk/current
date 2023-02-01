const Joi = require('joi')

const registerSchema = Joi.object({
  user_name: Joi.string().alphanum().min(3).max(30).required(),
  user_email: Joi.string().email().required(),
  password: Joi.string().min(3).max(10).required(),
  is_admin: Joi.boolean().required(),
})

const loginSchema = Joi.object({
  user_name: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(3).max(10).required(),
})

module.exports = {
  registerSchema,
  loginSchema,
}
