import express from "express";
import cors from "cors";
import {MongoClient, MongoClient, ObjectId} from "mongodb";
import joi from joi;
import dotenv from "dotenv";
dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient.connect().then(()=>{
    db =mongoClient.db("batepapoUOL")
})


server.listen (5000, () => console.log("listening on port 5000"));