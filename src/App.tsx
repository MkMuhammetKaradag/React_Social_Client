
import { ApolloProvider } from '@apollo/client';
import client from './graphql/apolloClient.ts';
import ReduxProvider from './context/ReduxProvider.tsx';
import Router from './Router/Router.tsx';
import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <ApolloProvider client={client}>
      <ReduxProvider>
        <BrowserRouter>
          <Router></Router>
        </BrowserRouter>
      </ReduxProvider>
    </ApolloProvider>
  );
}

export default App;
