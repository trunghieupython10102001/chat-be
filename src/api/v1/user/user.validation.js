const joi = require('joi')

const userValidateRegister = (data) => {
  const userSchema = joi.object({
    phone: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    password: joi.string().min(6).required(),
    confirm_password: joi.any().valid(joi.ref('password')).required(),
    username: joi.string(),
    birthday: joi.string(),
    first_name: joi.string(),
    last_name: joi.string(),
    email: joi.string().email().required(),
    gender: joi.string(),
    role: joi.string(),
    is_verified: joi.boolean(),
    avatar_url: joi.string(),
    description: joi.string(),
  })
  return userSchema.validate(data)
}

const userValidateUpdate = (data) => {
  const userSchema = joi.object({
    old_password: joi.string().min(6),
    new_password: joi.string().min(6),
    confirm_password: joi.any().valid(joi.ref('new_password')),
    birthday: joi.string(),
    username: joi.string(),
    first_name: joi.string(),
    last_name: joi.string(),
    email: joi.string().email(),
    gender: joi.string(),
    role: joi.string(),
    is_verified: joi.boolean(),
    avatar_url: joi.string().allow(''),
    description: joi.string(),
  })
  return userSchema.validate(data)
}

const userValidateLogin = (data) => {
  const userSchema = joi.object({
    phone: joi.string(),
    password: joi.string().min(6).required(),
  })
  return userSchema.validate(data)
}

module.exports = {
  userValidate: userValidateRegister,
  userValidateLogin: userValidateLogin,
  userValidateUpdate,
}
