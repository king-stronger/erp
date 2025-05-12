async function isAuthenticated(req, res, next){
    if(!req.user) return res.json({ message: "Must be authenticated" });

    return next();
}

async function isNotAuthenticated(req, res, next){
    if(req.user) return res.json({ message: "You're already authenticated !" });

    return next();
}

export {
    isAuthenticated,
    isNotAuthenticated
}