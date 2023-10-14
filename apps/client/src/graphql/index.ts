import { PUBLIC_API_URL } from '$env/static/public';
import { env } from '$env/dynamic/private';
import { GraphQLClient } from 'graphql-request';

export const graphQLClient = new GraphQLClient(
	(env.PRIVATE_BACKEND_API_URL || PUBLIC_API_URL) + '/graphql'
);
