import { PUBLIC_API_URL } from '$env/static/public';

import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import sha256 from 'fast-sha256';

const link = from([
	createPersistedQueryLink({ sha256: (input) => sha256(input).toString() }),
	new HttpLink({
		uri: PUBLIC_API_URL + '/graphql'
	})
]);

export const graphQLClient = new ApolloClient({
	ssrMode: true,
	link,
	cache: new InMemoryCache()
});
