const express = require("express");
const cors = require("cors");
const { publisher,subscriber } = require("./redis/pubsub");
const answerQueue = require('./bullmq/queues/answer.queue');
const questions = require("./data/questions");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/start-quiz", async (req, res) => {
  await publisher.publish("quiz_start", JSON.stringify(questions));
  res.json({ message: "Quiz started and questions sent" });
});

subscriber.subscribe("submitting-answer");

subscriber.on("message", async (channel, message) => {
  if (channel === "submitting-answer") {
    const payload = JSON.parse(message);
    await answerQueue.add("store-answer", payload);
    console.log("Answer pushed to BullMQ queue");
  }
});

app.listen(3000, () => {
  console.log("HTTP API server running at http://localhost:3000");
});
