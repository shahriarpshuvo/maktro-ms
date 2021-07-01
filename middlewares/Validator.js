const Joi = require('@hapi/joi');

const validateSchema = function (schema, data) {
  const validator = schema.validate(data);
  if (validator.error) {
    validator.error = validator.error.details[0].message.toUpperCase();
  }
  return validator;
};

const RegisterValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    email: Joi.string().lowercase().min(5).max(100).required().email().trim(),
    password: Joi.string().required().min(6),
    role: Joi.string().required().lowercase(),
  });
  return validateSchema(schema, data);
};

const LoginValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().lowercase().min(5).max(100).required().email().trim(),
    password: Joi.string().required().min(6),
  });
  return validateSchema(schema, data);
};

const ProductValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    code: Joi.string().uppercase().required().trim(),
    rate: Joi.number().required(),
  });
  return validateSchema(schema, data);
};

const EntryValidator = (data) => {
  const schema = Joi.object({
    product: Joi.string().uppercase().required().trim(),
    quantity: Joi.number().min(1).required(),
  });
  return validateSchema(schema, data);
};

const ServicingValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    address: Joi.string().required().trim(),
    phone: Joi.string().required().trim().max(11),
    product: Joi.string().uppercase().required().trim(),
    quantity: Joi.number().min(1).required(),
    serviceCharge: Joi.number().min(0).required(),
    deliveryDate: Joi.date().required(),
    status: Joi.string().required(),
  });
  return validateSchema(schema, data);
};

const ExpenseValidator = (data) => {
  const schema = Joi.object({
    purpose: Joi.string().required().trim(),
    equipments: Joi.number().min(0),
    transports: Joi.number().min(0),
    courierCommission: Joi.number().min(0),
    retailHoldings: Joi.number().min(0),
    stationeryTools: Joi.number().min(0),
    salaryUtilities: Joi.number().min(0),
    marketing: Joi.number().min(0),
    others: Joi.number().min(0),
  });
  return validateSchema(schema, data);
};

const CustomerValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    address: Joi.string().required().trim(),
    phone: Joi.string().required().trim(),
  });
  return validateSchema(schema, data);
};

const SaleValidator = (data) => {
  const schema = Joi.object({
    customer: Joi.string().required().trim(),
    product: Joi.string().required().trim(),
    quantity: Joi.number().min(0),
    rate: Joi.number().min(0),
    shippingCost: Joi.number().min(0),
    discount: Joi.number().min(0),
    paid: Joi.number().min(0),
    salesDate: Joi.date().required(),
  });
  return validateSchema(schema, data);
};

const ReturnValidator = (data) => {
  const schema = Joi.object({
    customer: Joi.string().required().trim(),
    product: Joi.string().required().trim(),
    quantity: Joi.number().min(0),
    amount: Joi.number().min(0),
  });
  return validateSchema(schema, data);
};

module.exports = {
  RegisterValidator,
  LoginValidator,
  ProductValidator,
  EntryValidator,
  ServicingValidator,
  ExpenseValidator,
  CustomerValidator,
  SaleValidator,
  ReturnValidator,
};
