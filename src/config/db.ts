import mongoose from "mongoose";
import { config } from "./config";
import { DatabaseConst } from "../constant/application";

class DatabaseConnection {
  retryCount: number;
  isConnected: boolean;

  constructor() {
    this.retryCount = 0;
    this.isConnected = false;

    // Bind methods to ensure `this` is correctly referenced
    this.connect = this.connect.bind(this);
    this.handleConnectionError = this.handleConnectionError.bind(this);
    this.handleDisconnection = this.handleDisconnection.bind(this);
    this.handleAppTermination = this.handleAppTermination.bind(this);

    // Configure mongoose event listeners
    mongoose.set("strictQuery", true);
    mongoose.connection.on("connected", () => {
      console.log("✅ Connected to database");
      this.isConnected = true;
    });
    mongoose.connection.on("error", () => {
      console.log("❌ Error connecting to database");
      this.isConnected = false;
    });
    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ Disconnected from database");
      this.isConnected = false;
      this.handleDisconnection();
    });

    // Corrected the typo: SIGINT instead of SINGINT
    process.on("SIGINT", this.handleAppTermination);
  }

  async connect() {
    const connectionOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };
    if (config.NODE_ENV === "development") {
      mongoose.set("debug", true);
    }
    try {
      await mongoose.connect(config.MONGO_URI, connectionOptions);
      this.retryCount = 0;
    } catch (error) {
      console.error("❌ Error connecting to database:", error);
      this.handleConnectionError();
    }
  }

  async handleConnectionError() {
    if (this.retryCount < DatabaseConst.MAX_RETRIES) {
      this.retryCount++;
      console.log(
        `🔄 Retrying connection... Attempt ${this.retryCount} of ${DatabaseConst.MAX_RETRIES}`
      );
      setTimeout(this.connect, DatabaseConst.RETRY_INTERVAL); // Fixed this issue
    } else {
      console.error("❌ Max retry limit reached. Exiting...");
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log("✅ Successfully disconnected from database");
    } catch (error) {
      console.error("❌ Error disconnecting from database:", error);
    }
  }

  async handleDisconnection() {
    if (!this.isConnected) {
      console.log("⚠️ Attempting to reconnect to database...");
      await this.connect();
    }
  }

  async handleAppTermination() {
    try {
      await mongoose.connection.close();
      console.log("🚪 MongoDB connection closed due to app termination");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error closing connection:", error);
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

// Creating a singleton instance
const dbConnection = new DatabaseConnection();

export default dbConnection.connect;
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);
