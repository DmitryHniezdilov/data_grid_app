import { ApolloClient, InMemoryCache } from '@apollo/client'

const isServer = typeof window === 'undefined'
const windowApolloState = !isServer && window.__NEXT_DATA__.apolloState

let CLIENT

export function getApolloClient(forceNew) {
  if (!CLIENT || forceNew) {
    CLIENT = new ApolloClient({
      ssrMode: isServer,
      uri: process.env.STRAPI_GRAPHQL_URL, // Server URL (must be absolute)
      cache: new InMemoryCache().restore(windowApolloState || {}),
    })
  }

  return CLIENT
}