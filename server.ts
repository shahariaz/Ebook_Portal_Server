import app from "./src/app";
import { config } from "./src/config/config";
import dbConnection from "./src/config/db";

const startServer = () => {
  const port = config.PORT;

  app.listen(port, () => {
    dbConnection();
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
