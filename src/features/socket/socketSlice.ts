import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';
import type { SocketStatus } from './types';

interface SocketState {
  status: SocketStatus;
  lastError: string | null;
}

const initialState: SocketState = {
  status: 'closed',
  lastError: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    socketConnecting: (state) => {
      state.status = 'connecting';
      state.lastError = null;
    },
    socketOpened: (state) => {
      state.status = 'open';
      state.lastError = null;
    },
    socketClosed: (state) => {
      state.status = 'closed';
      state.lastError = null;
    },
    socketError: (
      state,
      action: PayloadAction<{ message?: string } | undefined>
    ) => {
      state.lastError = action.payload?.message ?? 'Unknown socket error';
    },
  },
});

export const { socketConnecting, socketOpened, socketClosed, socketError } =
  socketSlice.actions;

export const selectSocketStatus = (state: RootState): SocketStatus =>
  state.socket.status;
export const selectIsSocketConnected = (state: RootState): boolean =>
  state.socket.status === 'open';

export default socketSlice.reducer;
