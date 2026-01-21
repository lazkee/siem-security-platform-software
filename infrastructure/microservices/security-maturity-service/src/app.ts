import express from "express";
import dotenv from "dotenv";
import { initialize_database } from "./Database/InitializeConnection";

dotenv.config();


const app = express();
app.use(express.json());
initialize_database();



export default app;
