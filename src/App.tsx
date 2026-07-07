import { Toaster } from 'react-hot-toast';

import './App.css';
import WebSocketLifecycle from './app/AppRoot';
import AppRoute from './router';

function App() {
  return (
    <>
      <WebSocketLifecycle>
        <AppRoute />
        <Toaster />
      </WebSocketLifecycle>
    </>
  );
}

export default App;
