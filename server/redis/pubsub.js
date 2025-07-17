import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
});


const publisher = redis;
const subscriber = redis.duplicate(); 


redis.ping().then((result) => {
  console.log("Redis Ping:", result);
}).catch((err) => {
  console.error("Redis connection error:", err);
});
export { publisher, subscriber };
