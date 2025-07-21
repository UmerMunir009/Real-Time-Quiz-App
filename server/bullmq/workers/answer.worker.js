const { Worker } = require('bullmq');
const connection = require('../../redis/connection');
const { Answer } = require('../../models'); 

const answerWorker = new Worker('answer-queue', async (job) => {
  console.log('Worker recieved a job')
  const { userId, questionId, answerIndex, isCorrect } = job.data;

  try {
    await Answer.create({ userId, questionId, answerIndex, isCorrect });
    console.log(`Answer stored  for user ${userId}`);
  } catch (error) {
    console.error(`DB insert failed for user ${userId}:`, error.message);
    throw error; 
  }
}, {
  connection,
});

answerWorker.on('failed', (job, err) => {
  console.error(`Job failed for user ${job?.data?.userId || 'unknown'}:`, err.message);
});
answerWorker.on('completed', (job) => {
  console.log(`Job completed for user ${job.data.userId}`);
});
