import { Sequelize } from "sequelize-typescript";
import envConfig from "../config/envConfig";

const sequelize = new Sequelize({
    database: envConfig.dbName!,
    username: envConfig.dbUsername!,
    password: envConfig.dbPassword!,
    host: envConfig.dbHost!,
    port: Number(envConfig.dbPort)!,
    dialect: "mysql",
    models: [__dirname + '/models']
});

sequelize.authenticate()
    .then(() => {
        console.log("Database connection established successfully.");
    })
    .catch((error) => {
        console.error("Unable to connect to the database:", error);
    })

export default sequelize;

// Migration
sequelize.sync({
    alter: false
}).then(() => {
    console.log("All models were synchronized successfully.");
})