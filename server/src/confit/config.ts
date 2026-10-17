import {config} from "dotenv";

config();

const envConfig = {
    PORT: process.env.PORT || 3000,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_here'
}
export default envConfig;