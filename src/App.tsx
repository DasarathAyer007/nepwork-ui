import { Toaster } from 'sonner';

import './App.css';
import AppRoute from './router';

function App() {
  return (
    <>
      <AppRoute />
      <Toaster />
    </>
  );
}

export default App;
