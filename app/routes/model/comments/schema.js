const Joi = require('joi');

module.exports = {
    postSchema: Joi.object().keys({
        title: Joi.string().max(100).trim().min(1).required(),
        comment: Joi.string().max(400).required()
    }),
    getSchema: Joi.object().keys({
        title: Joi.string().max(100).trim().min(1)
    })
}