const Joi = require('@hapi/joi');

const RegisterValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(100).required(),
        email: Joi.string().lowercase().min(5).max(100).required().email().trim(),
        password: Joi.string().required().min(6),
        role: Joi.string().required().lowercase(),
    });
    const validator = schema.validate(data);
    if(validator.error) {
        validator.error = validator.error.details[0].message.toUpperCase();
    };
    return validator;
};

const LoginValidator = (data) => {
    const schema = Joi.object({
        email: Joi.string().case("lower").min(5).max(100).required().email(),
        password: Joi.string().required().min(6),
    });
    const validator = schema.validate(data);
    if(validator.error) {
        validator.error = validator.error.details[0].message.toUpperCase();
    };
    return validator;
};

module.exports = { RegisterValidator , LoginValidator };