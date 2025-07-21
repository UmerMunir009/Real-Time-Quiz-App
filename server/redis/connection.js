const Redis = require('ioredis');

const connection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest:null
});

connection.ping()
  .then((result) => {
    console.log('BullMQ Redis Ping:', result);
  })
  .catch((err) => {
    console.error('BullMQ Redis connection error:', err);
  });

module.exports = connection;
