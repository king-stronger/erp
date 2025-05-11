async function errorHandler(err, req, res, next){
    const status = err.status || 500;

    return res.json({ 
        error: {
            status,
            message: err.message || "Something went wrong",
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        }
    });
}

export default errorHandler;