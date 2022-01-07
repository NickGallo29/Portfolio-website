const Joi = require("joi");

module.exports.commentJoi= Joi.object({
    comment: Joi.object({
        comment: Joi.string().max(1500).min(1).required()
    }).required()
})

module.exports.userJoi = Joi.object({
    firstName: Joi.string().max(25),
    lastName: Joi.string().max(25),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    username:Joi.string().max(20).alphanum().required(),
    password:Joi.string().required(),
    confirmPassword:Joi.string().required()
})
