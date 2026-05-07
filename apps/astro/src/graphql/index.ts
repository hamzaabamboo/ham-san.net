import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated/client';

const privateBackendApiUrl =
  process.env.PRIVATE_BACKEND_API_URL ?? import.meta.env.PRIVATE_BACKEND_API_URL;
const publicApiUrl = process.env.PUBLIC_API_URL ?? import.meta.env.PUBLIC_API_URL;

export const graphQLClient = new GraphQLClient((privateBackendApiUrl || publicApiUrl) + '/graphql');

export const graphQLSdk = getSdk(graphQLClient);
