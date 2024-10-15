import type React from "react";
import { createContext, useCallback } from "react";
import { useStoredState } from "../hooks/use-stored-state";
import { store } from "../utils/store";
import { createRoute } from "agrume";
import { authService } from "@culty/services";
import { useMutation, useQuery } from "react-query";
import { MINUTES_MS } from "../constants/durations";

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
  const [refreshToken, setRefreshToken, isRefreshTokenInitialized]
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

  const {
    data: tokensData,
    isLoading: isRefreshingToken,
    refetch: refreshTokens,
  } = useQuery({
    queryKey: ['refreshTokens', { refreshToken, antiCsrfToken }],
    queryFn: () => createRoute(authService.refreshToken)({
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      refreshToken: refreshToken!,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      antiCsrfToken: antiCsrfToken!,
    }),
    enabled: refreshToken !== undefined && antiCsrfToken !== undefined,
    onSuccess: (data) => {
      setRefreshToken(data.refreshToken.token);
      setRefreshTokenExpiresAt(data.refreshToken.expiresAt);
      setAntiCsrfToken(data.antiCsrfToken);

      const expiresIn = data.accessToken.expiresAt - Date.now();

      // Refresh the tokens 1 minute before the refresh token expires
      setTimeout(() => {
        refreshTokens();
      }, expiresIn - (1 * MINUTES_MS));
    },
  });

  const logout = useCallback(() => {
    setRefreshToken(undefined);
    setRefreshTokenExpiresAt(undefined);
    setAntiCsrfToken(undefined);
  }, [setRefreshToken, setRefreshTokenExpiresAt, setAntiCsrfToken]);

  const token = refreshToken === undefined ? undefined : tokensData?.accessToken.token;

  const isLoading = loginIsLoading || isRefreshingToken || !isRefreshTokenInitialized;

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
