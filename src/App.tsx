import { Toaster } from 'react-hot-toast';

import './App.css';
import WebSocketLifecycle from './app/AppRoot';
import NotificationToastListener from './features/notifications/components/NotificationToastListener';
import AppRoute from './router';

function App() {
  return (
    <>
      <WebSocketLifecycle>
        <AppRoute />
        <NotificationToastListener />
        <Toaster />
      </WebSocketLifecycle>
    </>
  );
}

export default App;
