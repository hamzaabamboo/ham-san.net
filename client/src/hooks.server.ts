import { PRIVATE_REDIS_URL } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import { redis } from "./redis";

//https://www.captaincodeman.com/speed-up-sveltekit-pages-with-a-redis-cache#why-you-might-use-ssr-instead-of-ssg
export const handle: Handle = async ({ event, resolve }) => {
    if (!PRIVATE_REDIS_URL || !redis.isReady) return await resolve(event)
    const { url } = event

    // Create a unique key to store the page in the
    // cache. I'm using "rendered" to differentiate
    // entries from other data in Redis and the "v1"
    // will allow invalidating the entire cache if
    // the application code will change rendering.
    // For a blog, I don't want to alter the cache
    // on every querystring parameter otherwise it
    // reduces the cache hit-rate due to parameters
    // other sites may add (such as "fbclid").
    const key = `rendered:v1:${url.pathname}`
  
    // ideally this is the only network request that
    // we make ... it will return an empty object if
    // the page wasn't cached or a populated object
    // containing body and headers
    let cached = await redis.hGetAll(key)
    if (!cached.body) {
      // if it wasn't cached, we render the pages
      const response = await resolve(event)
      
      // then convert it into a cachable object
      cached = Object.fromEntries(response.headers.entries())
      cached.body = await response.text()
  
      if (response.status === 200) {
        // and write it to the Redis cache ...
        // NOTE: although this returns a promise
        // we don't await it, so we don't delay
        // returning the response to the client
        // (the cache write is "fire and forget")
        redis.hSet(key, cached)
      }
    }
  
    // we end up here with the same object whether
    // it came from the cache or was rendered fresh
    // and we just return it as the response
    console.log("Using", key);
    const { body, ...headers } = cached
    return new Response(body, { headers: new Headers(headers) })
}