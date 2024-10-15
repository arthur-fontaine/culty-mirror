import { authService } from "@culty/services";
import { createRoute } from "agrume";
import type React from "react";
import { createContext, useCallback } from "react";
import { useMutation, useQuery } from "react-query";
import { MINUTES_MS } from "../constants/durations";
import { useStoredState } from "../hooks/use-stored-state";
import { store } from "../utils/store";

interface AuthContext {
  token: string | undefined;
  isLoading: boolean;
  login: (params: {
    email: string;
    password: string;
  }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContext>({
  token: undefined,
  isLoading: true,
  login: () => { },
  logout: () => { },
})

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [refreshToken, setRefreshToken, isRefreshTokenInitialLoading]
    = useStoredState<string | undefined>('refreshToken', undefined, store);
  const [refreshTokenExpiresAt, setRefreshTokenExpiresAt]
    = useStoredState<number | undefined>('refreshTokenExpiresAt', undefined, store);
  const [antiCsrfToken, setAntiCsrfToken]
    = useStoredState<string | undefined>('antiCsrfToken', undefined, store);

  const { mutate: login, isLoading: loginIsLoading } = useMutation({
    mutationFn: createRoute(authService.loginEmailPassword),
    onSuccess: (data) => {
      setRefreshToken(data.refreshToken.token);
      setAntiCsrfToken(data.antiCsrfToken);
      setRefreshTokenExpiresAt(data.refreshToken.expiresAt);
    },
  });

  const { data: tokensData, isLoading: isRefreshingToken, } = useQuery({
    queryKey: ['refreshTokens'],
    queryFn: () => createRoute(authService.refreshToken)({
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      refreshToken: refreshToken!,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      antiCsrfToken: antiCsrfToken!,
    }),
    enabled:
      refreshToken !== undefined &&
      antiCsrfToken !== undefined,
    refetchInterval: (data) => {
      if (data === undefined) return 0;
      const expiresIn = data.accessToken.expiresAt - Date.now();
      return expiresIn - (1 * MINUTES_MS);
    },
    onSuccess: (data) => {
      setRefreshToken(data.refreshToken.token);
      setRefreshTokenExpiresAt(data.refreshToken.expiresAt);
      setAntiCsrfToken(data.antiCsrfToken);
    },
  });

  const logout = useCallback(() => {
    setRefreshToken(undefined);
    setRefreshTokenExpiresAt(undefined);
    setAntiCsrfToken(undefined);
  }, [setRefreshToken, setRefreshTokenExpiresAt, setAntiCsrfToken]);

  const token = refreshToken === undefined ? undefined : tokensData?.accessToken.token;

  const isLoading = loginIsLoading || isRefreshingToken || isRefreshTokenInitialLoading;

  return (
    <AuthContext.Provider value={{
      token,
      login,
      logout,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
