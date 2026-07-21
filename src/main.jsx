import '@ant-design/v5-patch-for-react-19'
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import 'antd/dist/reset.css';
import './index.css';
import App from './App';
import store from './store/store';


const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
<React.StrictMode>
<Provider store={store}>
<QueryClientProvider client={queryClient}>


<App />


</QueryClientProvider>
</Provider>
</React.StrictMode>
);