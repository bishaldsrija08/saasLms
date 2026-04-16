import app from "./src/app";
import envConfig from "./src/config/envConfig";

// Connect to the database
import "./src/database/connection";



function startServer() {
    const port = envConfig.PORT || 3000;
    app.listen(port, () => {
        console.log("Server is running on port " + port);
    })
}
startServer()