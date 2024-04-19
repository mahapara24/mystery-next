import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URL || "", {});
    console.log(db);
    connection.isConnected = db.connections[0].readyState;
    console.log("Db is connected successfully");
  } catch (error) {
    console.log("database connection failed ", error);

    process.exit(1);
  }
}
export default dbConnect;
