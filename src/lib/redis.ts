import Redis from "ioredis";

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

if (!redisHost) {
  throw new Error("REDIS_HOST is not defined in the environment variables.");
}

if (!redisPort) {
  throw new Error("REDIS_PORT is not defined in the environment variables.");
}

const parsedPort = parseInt(redisPort, 10);

if (isNaN(parsedPort)) {
  throw new Error(`Invalid REDIS_PORT value: ${redisPort}`);
}

const redis = new Redis({
  host: redisHost || "localhost",
  port: parsedPort || 6379,
});

export default redis;
