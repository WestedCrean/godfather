const Joi = require('joi');

module.exports = {
    postCommentSchema: Joi.object().keys({
        title: Joi.string().max(100).trim().regex(/^[0-9a-zA-Z\s]+$/).required(),
        comment: Joi.string().max(400).required()
    }),
    getCommentSchema: Joi.object().keys({
        title: Joi.string().max(100).trim().regex(/^[0-9a-zA-Z\s]+$/)
    })
}