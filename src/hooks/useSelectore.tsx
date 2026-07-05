import type { AppDispatch, RootState } from '@/app/store';
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';

// Use these instead of plain `useDispatch` / `useSelector` throughout the app.
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
