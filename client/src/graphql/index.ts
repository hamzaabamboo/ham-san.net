import { PUBLIC_API_URL } from '$env/static/public';
import { GraphQLClient } from 'graphql-request';

export const graphQLClient = new GraphQLClient(PUBLIC_API_URL + '/graphql');
