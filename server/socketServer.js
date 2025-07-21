const { Server } = require("socket.io");
const { createServer } = require("http");
const questions = require("./data/questions");
const { subscriber, publisher } = require("./redis/pubsub");
const { Answer } = require("./models");

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userName) => {
    console.log(`User ${userName} registered with ID: ${socket.id}`);
  });

  socket.on("submit_answer", async ({ questionId, answer }) => {
    const question = questions.find((q) => q.id === questionId);
    let isCorrect = false;
    if (question && question.options[answer] === question.answer) {
      isCorrect = true;
    }
    console.log(socket.id);
    const data = {
      userId: socket.id,
      questionId,
      answerIndex: answer,
      isCorrect,
    };
    await publisher.publish("submitting-answer", JSON.stringify(data));
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

subscriber.subscribe("quiz_start");
subscriber.on("message", (channel, message) => {
  const parsedQuestions = JSON.parse(message);
  if (channel === "quiz_start") {
    let currentIndex = 0;

    const interval = setInterval(async () => {
      if (currentIndex >= parsedQuestions.length) {
        clearInterval(interval);

        const allAnswers = await Answer.findAll({where: { isCorrect: true },raw: true});
        const scoreMap = new Map();

        for (let { userId } of allAnswers) {
          scoreMap.set(userId, (scoreMap.get(userId) || 0) + 1);
        }

        const finalScores = Array.from(scoreMap, ([userId, score]) => ({
          userId,
          score,
        }));

        io.emit("quiz_scores", {
          message: "Quiz ended",
          scores: finalScores,
        });

        currentIndex = 0;
        return;
      }

      const currentQuestion = parsedQuestions[currentIndex];
      io.emit("question", {
        ...currentQuestion,
        timer: 15, 
      });

      currentIndex++;
    }, 15000); 
  }
});

httpServer.listen(3001, () => {
  console.log("Socket server running at http://localhost:3001");
});
