import { Sequelize } from "sequelize-typescript"
import envConfig from "../confit/config"
// import User from "../models/user.moel"

const sequelize = new Sequelize({
    database: envConfig.DB_NAME,
    username: envConfig.DB_USER,
    password: envConfig.DB_PASSWORD,
    host: envConfig.DB_HOST,
    dialect: "mysql",
    port: envConfig.DB_PORT,
    models: [__dirname + "/../models"]
})

export async function initializeDatabase() {
    await sequelize.authenticate().then(() => {
        console.log("Database connected successfully")
    }).catch((error)=>{
        console.error("Error connecting to database:", error)
    })

    // Migrate models to the database
    await sequelize.sync({ alter: true }).then(() => {
        console.log("Database synchronized successfully")
    }).catch((error) => {
        console.error("Error synchronizing database:", error)
    })
}

export default sequelize