// client.ts
import { InMemoryCache } from '@apollo/client';
import { API_URL } from '@utils/domain';
import { SvelteApolloClient } from 'svelte-apollo-client';

const client = SvelteApolloClient({
	uri: API_URL + '/graphql',
	cache: new InMemoryCache()
});

export default client;
