import { type ReactNode, useEffect } from 'react';

import {
  selectAccessToken,
  selectIsAuthenticated,
} from '@/features/auth/authSelectors';
import { useSelector } from 'react-redux';

import webSocketService from '@/services/webSocketService';

import { store } from './store';

const WS_BASE_URL = import.meta.env.VITE_API_WEB_SOCKET_URL; // adjust per environment

interface WebSocketLifecycleProps {
  children: ReactNode;
}

/**
 * Initializes the singleton WebSocketService exactly once, then connects /
 * disconnects it as auth state changes. Renders nothing itself — pure
 * lifecycle wiring, separate from any UI component, so the socket survives
 * route changes and component remounts.
 */
function WebSocketLifecycle({ children }: WebSocketLifecycleProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectAccessToken);

  //   const isAuthenticated = useAppSelector(selectIsAuthenticated);
  //   const token = useAppSelector(selectAuthToken);

  useEffect(() => {
    webSocketService.init(store, {
      wsBaseUrl: WS_BASE_URL,
      getToken: () => store.getState().auth.accessToken,
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      webSocketService.connect();
    } else {
      webSocketService.disconnect();
    }
  }, [isAuthenticated, token]);

  return <>{children}</>;
}

export default WebSocketLifecycle;

// interface AppRootProps {
//   children: ReactNode;
// }

// export default function AppRoot({ children }: AppRootProps) {
//   return (
//     <Provider store={store}>
//       <WebSocketLifecycle>{children}</WebSocketLifecycle>
//     </Provider>
//   );
// }
