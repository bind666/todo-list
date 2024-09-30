import createError from "http-errors";
import Joi from "joi";


const validateRegisterUser = (req, res, next) => {
    console.log(req.bod);
    
    const validationSchema = Joi.object({
        username: Joi.string().required().trim().min(3).disallow(""),
        password: Joi.string().required().min(3).max(16),
        email: Joi.string().required().email().disallow(""),
        role: Joi.string().required().default("user").disallow("")
    })

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
        return next(createError(422, error.message))
    }
    req.body = value;
    next()
}

const validateLoginUser = (req, res, next) => {
    const validationSchema = Joi.object({
        email: Joi.string().required().email().disallow(""),
        password: Joi.string().required().min(3).max(16)
    })

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
        return next(createError(422, error.message))
    }
    req.body = value;
    next()
}

const validateFetchRequest = (req, res, next) => {
    const validationSchema = Joi.object({
        page: Joi.number().default(1).disallow(0),
        limit: Joi.number().default(10).disallow(0),
        sort: Joi.string().default("asc").disallow(""),
        id: Joi.string(),
    })

    const { error, value } = validationSchema.validate(req.query)
    if (error) {
        return next(createError(422, "Id required."))
    }

    req.query = value;
    next()
}

export { validateRegisterUser, validateLoginUser ,validateFetchRequest};