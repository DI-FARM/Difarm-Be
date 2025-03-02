import Joi from "joi";

const cattleSchema = Joi.object({
    tagNumber: Joi.string().min(3).trim().required(),
    breed: Joi.string().min(3).trim().required(),
    gender: Joi.string().valid('Bull', 'Cow', 'Other').required(),
    // DOB: Joi.date().iso().required(),
    weight: Joi.number().positive().required(),
    location: Joi.string().min(3).trim().required(),
    farmId: Joi.string().uuid().required(),
    lastCheckupDate: Joi.date().iso().required(),
    vaccineHistory: Joi.string().min(3).trim(),
    
    birthOrigin: Joi.string().valid('OnFarm', 'Purchased').required(),
    
    // These fields are required only if birthOrigin is 'Purchased'
    purchaseDate: Joi.date().iso().when('birthOrigin', {
        is: 'Purchased',
        then: Joi.required(),
        otherwise: Joi.allow(null)
    }),
    previousOwner: Joi.string().when('birthOrigin', {
        is: 'Purchased',
        then: Joi.required(),
        otherwise: Joi.allow(null)
    }),
    price: Joi.number().positive().when('birthOrigin', {
        is: 'Purchased',
        then: Joi.required(),
        otherwise: Joi.allow(null)
    }),
    
    // This field is required only if birthOrigin is 'Farm'
    motherId: Joi.string().when('birthOrigin', {
        is: 'OnFarm',
        then: Joi.required(),
        otherwise: Joi.allow(null)
    }),
    // This field is required only if birthOrigin is 'Farm'
    DOB: Joi.date().iso().when('birthOrigin', {
        is: 'OnFarm',
        then: Joi.required(),
        otherwise: Joi.allow(null)
    })
});
const updateCattleSchema = Joi.object({
    tagNumber: Joi.string().min(3).trim().optional(),  // Optional for update
    breed: Joi.string().min(3).trim().optional(),
    gender: Joi.string().valid('Bull', 'Cow', 'Other').optional(),
    weight: Joi.number().positive().optional(),
    location: Joi.string().min(3).trim().optional(),
    farmId: Joi.string().uuid().optional(),
    lastCheckupDate: Joi.date().iso().optional(),
    vaccineHistory: Joi.string().min(3).trim().optional(),
    
    birthOrigin: Joi.string().valid('OnFarm', 'Purchased').optional(),
    
    // These fields are required only if birthOrigin is 'Purchased' or if they're provided in the update
    purchaseDate: Joi.date().iso().when('birthOrigin', {
        is: 'Purchased',
        then: Joi.required(),
        otherwise: Joi.valid(null).required()
    }),
    previousOwner: Joi.string().when('birthOrigin', {
        is: 'Purchased',
        then: Joi.required(),
        otherwise: Joi.valid(null).required()
    }),
    DOB: Joi.date().iso().when('birthOrigin', {
        is: 'OnFarm',
        then: Joi.required(),
        otherwise: Joi.valid(null).required()
    }),
    price: Joi.number().positive().when('birthOrigin', {
        is: 'Purchased',
        then: Joi.required(),
        otherwise: Joi.valid(null).required()
    }),
    
    // This field is required only if birthOrigin is 'OnFarm'
    motherId: Joi.string().when('birthOrigin', {
        is: 'OnFarm',
        then: Joi.required(),
        otherwise: Joi.valid(null).required()
    })
});

const cattleSummarySchema = Joi.object({
    year: Joi.number().positive().greater(1000),
});

const validateForm = (schema: Joi.ObjectSchema<any>) => (payload: any) => schema.validate(payload, { abortEarly: false });
const cattleValidation = validateForm(cattleSchema);
const updateCattleValidation = validateForm(updateCattleSchema);
const cattleSummaryValidation = validateForm(cattleSummarySchema);

export default {cattleValidation, updateCattleValidation, cattleSummaryValidation};
