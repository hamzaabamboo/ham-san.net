import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated/client';

export const graphQLClient = new GraphQLClient(
  (import.meta.env.PRIVATE_BACKEND_API_URL || import.meta.env.PUBLIC_API_URL) + '/graphql'
);

export const graphQLSdk = getSdk(graphQLClient);
