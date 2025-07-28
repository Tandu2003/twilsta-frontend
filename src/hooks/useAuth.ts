// Custom hook để kiểm tra authentication status
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { handleGetProfile } from '@/handlers/user.handlers';

import { useAppDispatch, useAppSelector } from './redux';
import { useApiWithRefresh } from './useApiWithRefresh';

export function useAuth() {
  const dispatch = useAppDispatch();
  const callApi = useApiWithRefresh();
  const [isInitialized, setIsInitialized] = useState(false);
  const hasInitialized = useRef(false);

  // Lấy state từ Redux
  const authUser = useAppSelector(state => state.auth.user);
  const authStatus = useAppSelector(state => state.auth.status);
  const userProfile = useAppSelector(state => state.user.profile);
  const userStatus = useAppSelector(state => state.user.status);

  // Memoize authentication status để tránh re-render không cần thiết
  const isAuthenticated = useMemo(() => !!(authUser || userProfile), [authUser, userProfile]);
  const isLoading = useMemo(
    () => authStatus === 'loading' || userStatus === 'loading',
    [authStatus, userStatus]
  );

  // Memoize user để tránh re-render
  const user = useMemo(() => userProfile || authUser, [userProfile, authUser]);

  // Memoize callApi để tránh dependency thay đổi
  const stableCallApi = useCallback(callApi, []);

  // Load user profile khi component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      // Chỉ gọi một lần khi component mount
      if (!hasInitialized.current) {
        hasInitialized.current = true;

        try {
          // Luôn thử gọi getProfile để kiểm tra authentication
          await handleGetProfile(dispatch, stableCallApi);
        } catch (error) {
          console.error('useAuth: Lỗi khi load user profile:', error);
        } finally {
          setIsInitialized(true);
        }
      }
    };

    loadUserProfile();
  }, [dispatch, stableCallApi]);

  // Reset khi logout - chỉ chạy khi thực sự cần
  useEffect(() => {
    if (authStatus === 'idle' && !isAuthenticated && isInitialized && hasInitialized.current) {
      hasInitialized.current = false;
      setIsInitialized(false);
    }
  }, [authStatus, isAuthenticated, isInitialized]);

  return {
    isAuthenticated,
    isLoading,
    isInitialized,
    user,
    authUser,
    userProfile,
  };
}
