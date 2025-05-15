function validate(schema){
    return (req, res, next) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No data received" });
        }
        
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        });
    
        if (error) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.details.map(d => d.message),
            });
        }
    
        req.validatedBody = value;
        next();
    };
}


export {
    validate
}