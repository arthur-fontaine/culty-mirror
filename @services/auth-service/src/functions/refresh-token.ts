import type { AuthService } from "../../types/typescript"
import { supertokensCoreApi } from "../supertokens-core-api"

export const refreshToken: AuthService["refreshToken"] = async (request) => {
  const sessionResponse = await supertokensCoreApi.POST('/appid-{appId}/recipe/session/refresh', {
    params: {
      path: {
        appId: 'public',
      } as never,
    },
    body: {
      enableAntiCsrf: true,
      refreshToken: request.refreshToken,
      useDynamicSigningKey: true,
      antiCsrfToken: request.antiCsrfToken,
    },
  })

  if (sessionResponse.data?.status !== "OK") {
    throw new Error("Failed to verify access token") // TODO: throw a more specific error
  }

  return {
    userId: sessionResponse.data.session.userId,
    accessToken: {
      token: sessionResponse.data.accessToken.token,
      expiresAt: sessionResponse.data.accessToken.expiry,
    },
    refreshToken: {
      token: sessionResponse.data.refreshToken.token,
      expiresAt: sessionResponse.data.refreshToken.expiry,
    },
    antiCsrfToken: sessionResponse.data.antiCsrfToken,
  }
}
