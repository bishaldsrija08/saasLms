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
.then(()=>{
    console.log("Authenticated, connected")
})
.catch((error)=>{
    console.log(error)
})

// migrate garnu parxa/ push garnu parxa 
sequelize.sync({alter: true})
.then(()=>{
    console.log("migrated successfully new changes")
})

export default sequelize