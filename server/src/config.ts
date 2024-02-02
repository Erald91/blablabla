export const config = Object.freeze({
  version: '0.0.1',
  port: process.env.SERVER_PORT,
  dbHost: process.env.DATABASE_HOST,
  dbPort: process.env.DATABASE_PORT,
  dbName: process.env.DATABASE_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION
});
