import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../lib/apolloClient'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }) => {
  const client = getApolloClient()

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp