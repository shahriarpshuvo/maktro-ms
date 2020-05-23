const Joi = require('@hapi/joi');

const validateSchema = function (schema, data){
    const validator = schema.validate(data);
    if(validator.error) {
        validator.error = validator.error.details[0].message.toUpperCase();
    };
    return validator;
}

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
        name: Joi.string().min(3).required().trim(),
        code: Joi.string().uppercase().min(3).required().trim(),
        rate: Joi.number().min(2).required().trim(),
    });
    return validateSchema(schema, data);
}

module.exports = { RegisterValidator, LoginValidator, ProductValidator };