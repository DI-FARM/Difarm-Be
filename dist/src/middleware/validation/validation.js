"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validate;
function validate(schema) {
    return (req, res, next) => {
        const Validate = schema.validate(req.body);
        if (Validate.error) {
            res.status(406).send({
                code: 406,
                error: Validate.error.message,
            });
        }
        else {
            next();
        }
    };
}
