import app from "./src/app";
import { config } from "./src/config/config";

const startServer = () => {
  const port = config.PORT;
  app.listen(port, () => {
    console.log("Server is running on port 3000");
  });
};

startServer();
