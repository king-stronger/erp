async function isAuthenticated(req, res, next){
    if(req.user) res.json({ message: "Not authenticated" });

    return next();
}

async function isNotAuthenticated(req, res, next){
    if(!req.user) res.json({ message: "Must be authenticated" });

    return next();
}

export {
    isAuthenticated,
    isNotAuthenticated
}