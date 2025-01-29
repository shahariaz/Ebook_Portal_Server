import mongoose from "mongoose";
import { config } from "./config";
import { DatabaseConst } from "../constant/application";

class DatabaseConnection {
  retryCount: number;
  isConnected: boolean;
  constructor() {
    this.retryCount = 0;
    this.isConnected = false;
    //configure mongoose
    mongoose.set("strictQuery", true);
    mongoose.connection.on("connected", () => {
      console.log("Connected to database");
      this.isConnected = true;
    });
    mongoose.connection.on("error", () => {
      console.log("Error connecting to database");
      this.isConnected = false;
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Disconnected from database");
      this.isConnected = false;
      this.handleDisconnection();
    });
    process.on("SINGINT", this.handleAppTermination.bind(this));
  }

  async connect() {
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };
    if (config.NODE_ENV === "development") {
      mongoose.set("debug", true);
    }
    try {
      await mongoose.connect(config.MONGODB_URI, connectionOptions);
      this.retryCount = 0;
    } catch (error) {
      console.log("Error connecting to database", error);
      this.handleConnectionError();
    }
  }
  async handleConnectionError() {
    try {
      if (this.retryCount < DatabaseConst.MAX_RETRIES) {
        this.retryCount++;
        console.log(
          `Retrying connection ... Attemp ${this.retryCount} of ${DatabaseConst.MAX_RETRIES}`
        );
        setTimeout(() => {
          this.connect();
        }, DatabaseConst.RETRY_INTERVAL);
      }
      return false;
    } catch (error) {
      console.log("Error handling connection error", error);
      process.exit(1);
    }
  }
  async disconnect() {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.log("Error disconnecting from database", error);
    }
  }
  async handleDisconnection() {
    if (!this.isConnected) {
      console.log("Attemptiong to reconnect to database");
      await this.connect();
    }
  }
  async handleAppTermination() {
    try {
      await mongoose.connection.close();
      console.log("mongoDB connection closed through app termination  ");
      process.exit(0);
    } catch (error) {
      console.log("Error closing connection", error);
      process.exit(1);
    }
  }
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
  }
}

// createing a singleton instance
const dbConnection: DatabaseConnection = new DatabaseConnection();

export default dbConnection.connect.bind(dbConnection);
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);
