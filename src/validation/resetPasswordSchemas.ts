import Joi from 'joi'

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'co'] } }).trim().required(),
});

export default {forgotPasswordSchema}