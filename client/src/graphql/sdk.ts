import { graphQLClient } from '@graphql';
import { getSdk } from './generated/server';

export const graphQLSdk = getSdk(graphQLClient);
