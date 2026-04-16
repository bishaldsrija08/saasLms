// env configuration
import { config } from "dotenv";
config();

const envConfig = {
    PORT: process.env.PORT || 3000,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME
}

export default envConfig;