import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
const app = express();

// IMPORTANT — parse JSON
app.use(express.json());

// route mounting
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
const DB = process.env.MONGO_URL;

app.get("/", (req, res) => {
  res.send("Hello World");
});

const start = async () => {
  try {
    const connectionDB = await mongoose.connect(DB);
    console.log(`MONGO Connection DB Host : ${connectionDB.connection.host}`);

    //starting the server
    app.listen(PORT, () => {
      console.log(`Server is listening to the Port ${PORT}`);
    });
  } catch (error) {
    console.log(`Something went wrong ${error}`);
  }
};

start();
