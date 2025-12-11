import 'dotenv/config';
export const env = {
  port: parseInt(process.env.PORT || '5000'),
  mongoUri: process.env.MONGODB_URI || '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh'
};
