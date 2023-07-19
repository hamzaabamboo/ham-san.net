import { PRIVATE_REDIS_URL } from '$env/static/private';
import { createClient } from 'redis';

export const redis = createClient({ url: PRIVATE_REDIS_URL })
try {
    if (PRIVATE_REDIS_URL) {
        await redis.connect()
        console.log("Redis Connected")
    }
} catch (error) {
    console.log("Redis not available", error)
}