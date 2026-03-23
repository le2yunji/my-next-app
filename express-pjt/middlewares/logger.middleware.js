/**
@param {import("express").Request} req
@param {import("express").Response} res
@param {import("express").NextFunction} next
*/
const loggerMiddleware = (req, _res, next) => {
  const method = req.method ?? "GET";
  const pathName = req.originalUrl ?? "(none)";
  // console.log(`[${method}] ${pathName} ${Date.now()}`);
  next();
};
module.exports = loggerMiddleware;
