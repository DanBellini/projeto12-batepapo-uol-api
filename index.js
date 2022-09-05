import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import dayjs from "dayjs";
import dotenv from "dotenv";
dotenv.config()


const server = express();
server.use(cors());
server.use(express.json());

const mongoClient = new MongoClient("mongodb://localhost:27017/");
//aparentemente tive problemas com o documento .env, antes de finalizar a entrega tentarei concertar...

let db;

mongoClient.connect().then(()=>{
    db = mongoClient.db("batepapo-uol")
});

const participantSchema = joi.object({
    name: joi.string().required()
});


server.post('/participants', async(req, res)=>{
    const participant = req.body

    const validation = participantSchema.validate(participant);

    if (validation.error){
        return res.sendStatus(422)
    }

    try {
        const participantFound = await db.collection("participantes").findOne({name: participant.name})
        if (participantFound){
            return res.sendStatus(409)
        }

        const teste = await db.collection("participantes").insertOne({name:participant.name, lastStatus: Date.now() });

        await db.collection("mensagens").insertOne({
            from: participant.name, to: 'Todos', text: 'entra na sala...', type: 'status', time: dayjs().format('HH:mm:ss')
        });
        console.log(teste)
        res.sendStatus(201);

    } catch (error) {
        console.log(error)
    }
});

server.get('/participants', async (req, res)=>{
    try {
        const participants = await db.collection("participantes").find().toArray();

        res.send(participants);

    } catch (error) {
        console.log(error)
    }
})


server.listen (5000, () => console.log("listening on port 5000"));