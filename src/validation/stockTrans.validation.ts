import Joi from 'joi';

const transactionSchema = Joi.object({
    stockId: Joi.string().required(),
    quantity: Joi.number().positive().required(),
    type: Joi.string().valid('ADDITION', 'SUBTRACTION').required()
});

const validateTransaction = (payload: any) => transactionSchema.validate(payload, { abortEarly: false });

export default validateTransaction;
