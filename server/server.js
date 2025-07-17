import express from "express";
import cors from "cors";
import { publisher } from "./redis/pubsub.js";
import questions from "./data/questions.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/start-quiz", async (req, res) => {
  await publisher.publish("quiz_start", JSON.stringify(questions));
  res.json({ message: "Quiz started and questions sent" });
});

app.listen(3000, () => {
  console.log("HTTP API server running at http://localhost:3000");
});
