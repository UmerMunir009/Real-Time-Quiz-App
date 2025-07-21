const { Queue } = require('bullmq');
const connection = require('../../redis/connection');

const answerQueue = new Queue('answer-queue', {
  connection,
  defaultJobOptions: {
    removeOnFail: false,
  },
});

module.exports = answerQueue;
