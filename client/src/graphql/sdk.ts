import { graphQLClient } from '@graphql';
import { getApolloSdk } from './getApolloSdk';

export const graphQLSdk = getApolloSdk(graphQLClient);
