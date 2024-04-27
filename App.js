import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import Main from './components/Main';

const client = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={client}>
      <Main />
    </QueryClientProvider>
  );
}
