function errorHandler(err, req, res, next) {
    let statusCode = 500;
    if (err.message.includes('not found')) statusCode = 404;
    if (err.message.includes('required') || err.message.includes('Invalid')) statusCode = 400;
    if (err.message.includes('UNIQUE')) statusCode = 409;

    res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
}
module.exports = errorHandler;