// Main file

import app from "./src/app";
import envConfig from "./src/confit/config";





// server start
function startServer() {
    const port = envConfig.PORT || 3000;
    app.listen(port, () => {
        console.log("Server is running on port " + port);
    })
}

startServer();