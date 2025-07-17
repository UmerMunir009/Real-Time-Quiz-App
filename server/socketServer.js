import { Server } from "socket.io";
import { createServer } from "http";
import questions from "./data/questions.js"; 
import {subscriber } from "./redis/pubsub.js";

const httpServer = createServer();
const io = new Server(httpServer, {cors: { origin: "*" },});

let users = {};   // socket.id => userName
let scores = {};  // socket.id => score

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userName) => {
    users[socket.id] = userName;
    scores[socket.id] = 0;
    console.log(`User ${userName} registered with ID: ${socket.id}`);
  });

  socket.on("submit_answer", ({ questionId, answer }) => {
    const question = questions.find(q => q.id === questionId);
    // console.log(question)
    // console.log(question.options[answer],question.answer)
    if (question && question.options[answer] === question.answer) {
      scores[socket.id]++;
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id];
    delete scores[socket.id];
  });
});


subscriber.subscribe("quiz_start");
subscriber.on("message", (channel, message) => {
    const parsedQuestions = JSON.parse(message); 
  if (channel === "quiz_start") {
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex >= parsedQuestions.length) {
        clearInterval(interval);

        io.emit("quiz_end", {
          message: "Quiz ended",
          scores: Object.entries(scores).map(([socketId, score]) => ({
            user: users[socketId],
            score,
          })),
        });

        currentIndex = 0;
        return;
      }

      // Send next question to all users
      const currentQuestion = parsedQuestions[currentIndex];
      io.emit("question", {
        ...currentQuestion,
        timer: 5, // Frontend will count down from this
      });

      currentIndex++;
    }, 5000); // 30 seconds per question
  }
});

httpServer.listen(3001, () => {
  console.log("Socket server running at http://localhost:3001");
});
