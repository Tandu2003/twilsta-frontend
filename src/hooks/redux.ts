import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';

// Sử dụng cho dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
// Sử dụng cho selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
