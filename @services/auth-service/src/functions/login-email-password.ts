import type { AuthService, IBadCredentials } from "../../types/typescript"
import { supertokensCoreApi } from "../supertokens-core-api"

const createBadCredentialsError = (errorInstanceId: string) => new Error(JSON.stringify({
  errorCode: "PERMISSION_DENIED",
  errorInstanceId,
  errorName: "AuthService:BadCredentials",
  parameters: {},
} satisfies IBadCredentials))

export const loginEmailPassword: AuthService["loginEmailPassword"] = async (request) => {
  const signinResponse = await supertokensCoreApi.POST('/appid-{appId}/{tenantId}/recipe/signin', {
    params: {
      path: {
        appId: 'public',
        tenantId: 'public',
      } as never,
    },
    body: {
      email: request.email,
      password: request.password,
    },
  })

  if (signinResponse.data?.status !== "OK") {
    throw createBadCredentialsError('')
  }

  const userId = signinResponse.data.user.id

  const sessionResponse = await supertokensCoreApi.POST('/appid-{appId}/{tenantId}/recipe/session', {
    params: {
      path: {
        appId: 'public',
        tenantId: 'public',
      } as never,
    },
    body: {
      enableAntiCsrf: true,
      useDynamicSigningKey: true,
      userId,
      userDataInDatabase: {},
      userDataInJWT: {},
    },
  })

  if (sessionResponse.data?.status !== "OK") {
    throw new Error("Failed to create session") // TODO: throw a more specific error
  }

  return {
    userId,
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
