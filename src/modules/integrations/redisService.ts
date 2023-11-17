// import Elysia from "elysia";
// import Redis from "ioredis";
// import { invariant } from "../common/utils/invariant";

// const redisUrl = invariant(process.env.REDIS_URL, "REDIS_URL is not defined");
// const redis = new Redis(redisUrl);
// await redis.set("count", 0);

// export const redisService = new Elysia()
//     .decorate({ redis })