// client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { API_URL } from '@utils/domain';

const client = new ApolloClient({
	uri: API_URL + '/graphql',
	cache: new InMemoryCache()
});

export default client;
