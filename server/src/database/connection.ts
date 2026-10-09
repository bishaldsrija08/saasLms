import {Sequelize} from "sequelize"
import envConfig from "../confit/config"

const sequelize = new Sequelize({
    database: envConfig.DB_NAME,
    username: envConfig.DB_USER,
    password: envConfig.DB_PASSWORD,
    host: envConfig.DB_HOST,
    dialect: "mysql",
    port: envConfig.DB_PORT
})

sequelize.authenticate().then(()=>{
    console.log("Database connected successfully")
}).catch((err)=>{
    console.error("Unable to connect to the database:", err)
})

export default sequelize