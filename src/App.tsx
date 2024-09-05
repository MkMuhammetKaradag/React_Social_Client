import CreatePost from './components/CreatePost';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/apolloClient.ts';
import ReduxProvider from './context/ReduxProvider.tsx';
function App() {
  return (
    <ApolloProvider client={client}>
      <ReduxProvider>
        <CreatePost></CreatePost>
      </ReduxProvider>
    </ApolloProvider>
  );
}

export default App;
