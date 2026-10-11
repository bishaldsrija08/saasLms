// Main file

import app from "./src/app";
import envConfig from "./src/confit/config";
import { initializeDatabase } from "./src/database/connection";



// server start
async function startServer() {
    await initializeDatabase();
    const port = envConfig.PORT || 3000;
    app.listen(port, () => {
        console.log("Server is running on port " + port);
    })
}

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
});