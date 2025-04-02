import { redisClient } from "../config/Redis.config.js";

class RedisClient {
  constructor() {
    this.redisClient = redisClient;
  }

  async set(key, value) {
    try {
      if (!key || !value) {
        throw new Error("Key and value are null");
      }

      const stringifiedValue = JSON.stringify(value);

      await this.redisClient.set(key, stringifiedValue);
      await this.redisClient.expire(key, 3600 * 24); // Expire after 24 hours

      return true;
    } catch (error) {
      console.error("Redis set error:", error);
      return false;
    }
  }

  async get(key) {
    try {
      const result = await this.redisClient.get(key);
      if (!result) {
        return null;
      }
      return JSON.parse(result);
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }
}

export default new RedisClient();
