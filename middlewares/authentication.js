async function isAuthenticated(req, res, next){
    if(req.user) res.json({ message: "Not authenticated" });

    return next();
}

export {
    isAuthenticated
}