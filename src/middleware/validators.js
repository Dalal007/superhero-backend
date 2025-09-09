import Joi from "joi";

const registerSchema = Joi.object({
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).max(254).required(),
  name: Joi.string().trim().min(2).max(100).required(),
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(/[a-z]/, { name: "lowercase" })
    .pattern(/[A-Z]/, { name: "uppercase" })
    .pattern(/[0-9]/, { name: "digit" })
    .pattern(/[^A-Za-z0-9]/, { name: "special" })
    .required()
    .messages({
      "string.min": "Password must be at least {#limit} characters",
      "string.max": "Password must be at most {#limit} characters",
      "string.pattern.name": "Password must include a {#name} character",
      "string.empty": "Password is required",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
});

function respondValidation(res, details) {
  const errors = details.map((d) => ({ field: d.path.join("."), message: d.message }));
  return res.status(422).json({ message: "Validation failed", errors });
}

export function validateRegister(req, res, next) {
  const { value, error } = registerSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return respondValidation(res, error.details);
  req.body = value;
  next();
}

export function validateLogin(req, res, next) {
  const { value, error } = loginSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return respondValidation(res, error.details);
  req.body = value;
  next();
}


