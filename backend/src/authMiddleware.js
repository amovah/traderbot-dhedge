export default async function authMiddleware(req, res, next) {
  if (!req.header('Authorization')) {
    res.status(401).send({ error: 'Not authorized to access this resource' });
  }

  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token !== process.env.APP_AUTH_TOKEN) {
    res.status(401).send({ error: 'Not authorized to access this resource' });
  } else {
    next();
  }
}
