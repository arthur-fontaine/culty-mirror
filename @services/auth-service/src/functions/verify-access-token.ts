import type { AuthService } from "../../types/typescript"
import { supertokensCoreApi } from "../supertokens-core-api"

export const verifyAccessToken: AuthService["verifyAccessToken"] = async (request) => {
  const sessionResponse = await supertokensCoreApi.POST('/appid-{appId}/recipe/session/verify', {
    params: {
      path: {
        appId: 'public',
      } as never,
    },
    body: {
      accessToken: request.accessToken,
      antiCsrfToken: request.antiCsrfToken,
      checkDatabase: true,
      doAntiCsrfCheck: true,
      enableAntiCsrf: true,
    },
  })

  if (sessionResponse.data?.status !== "OK") {
    throw new Error("Failed to verify access token") // TODO: throw a more specific error
  }

  return {
    userId: sessionResponse.data.session.userId,
  }
}
