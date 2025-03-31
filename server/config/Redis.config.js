import { createClient } from 'redis';
import * as dotenv from 'dotenv';
dotenv.config();

export const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 18473,
    }
});

export const setupRedis = async () => {
    redisClient.on('error', err => console.log('Redis Client Error', err));

    return new Promise(async (resolve, reject) => {
        try 
        {
            await redisClient.connect();
            const result = await redisClient.get('foo');
            console.log(result);
            resolve("Redis connected sucessfully");
        } 
        catch (err) 
        {
            console.error('Redis operation failed:', err);
            reject(err);
        }
    });
}

