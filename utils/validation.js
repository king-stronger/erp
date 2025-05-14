function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.json({ errors: error.details.map(d => d.message) });
        }
        req.validatedBody = value;
        next();
    }
}


export {
    validate
}