// client.ts
import { InMemoryCache } from '@apollo/client/core';
import { SvelteApolloClient } from 'svelte-apollo-client';

const client = SvelteApolloClient({
	uri: 'http://localhost:1337/graphql',
	cache: new InMemoryCache()
});

export default client;
