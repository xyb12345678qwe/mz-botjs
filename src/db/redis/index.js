import { Redis } from "ioredis";

export class RedisManager {
  constructor(prefix, options = {}) {
    this.client = new Redis(options);
    this.prefix = prefix;
    this.client.on("error", (err) => {
      this.emit("error", err);
    });
  }

  mapFieldToKey(field, uid) {
    return `${this.prefix}:${field}:${uid}`;
  }

  async redisCommand(command, key, ...args) {
    try {
      const redisKey = this.mapFieldToKey(key);
      return await this.client[command](redisKey, ...args);
    } catch (err) {
      this.emit("error", err);
      return null;
    }
  }

  async setRedisKey(key, uid, data) {
    return this.redisCommand('set', key, uid, JSON.stringify(data));
  }

  async getRedisKey(key, uid) {
    const value = await this.redisCommand('get', key, uid);
    return value ? JSON.parse(value) : null;
  }

  async delRedisKey(key, uid) {
    return this.redisCommand('del', key, uid);
  }

  async getAllRedisKey(partialKey) {
    const redisKeyPrefix = this.mapFieldToKey(partialKey);
    const result = [];
    let cursor = "0";
    do {
      const [newCursor, matchingKeys] = await this.client.scan(
        cursor,
        "MATCH",
        `*${redisKeyPrefix}*`,
        "COUNT",
        100
      );
      cursor = newCursor;
      if (matchingKeys.length > 0) {
        const pipeline = this.client.pipeline();
        matchingKeys.forEach((key) => {
          pipeline.get(key);
        });
        const responses = await pipeline.exec();
        responses.forEach(([_, value]) => {
          if (value) {
            result.push(JSON.parse(value));
          }
        });
      }
    } while (cursor !== "0");
    return result;
  }

  dispose() {
    this.client.disconnect();
  }

  emit(eventName, ...args) {
    process.emit(eventName, ...args);
  }
}


// const RedisManager = new redisManager("xiuxian-plugin", {
//   host: "localhost",
//   port: 6379,
// });

// export { redisManager };