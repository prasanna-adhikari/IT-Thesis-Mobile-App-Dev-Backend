import redis from "redis";

// Create Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379", // Your Redis connection URL
});

redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});

// Connect to Redis server
redisClient.connect();

export default redisClient;
