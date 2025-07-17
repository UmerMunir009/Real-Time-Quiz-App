# Real-Time Quiz App 
A multiplayer real-time quiz app using:

-  Node.js (Express)
-  Socket.IO for real-time communication
-  Redis Pub/Sub for inter-service messaging
-  HTML,CSS,Vanilla JS frontend

## Features

- Admin triggers quiz from API
- Questions are broadcast live with a 30-second timer to all connected users
- Players submit answers simultaneously
- Final scores and winner shown at the end

## How to Run

->Start redis on your linux 
->Install dependencies
->Run API server
->Run Socket server
->Hit API using any tool to start quiz then quiz will be broadcasted to live users
