import type { AuthService, IBadCredentials } from "../../types/typescript"
import { supertokensCoreApi } from "../supertokens-core-api"

const createBadCredentialsError = (errorInstanceId: string) => new Error(JSON.stringify({
  errorCode: "PERMISSION_DENIED",
  errorInstanceId,
  errorName: "AuthService:BadCredentials",
  parameters: {},
} satisfies IBadCredentials))

export const loginEmailPassword: AuthService["loginEmailPassword"] = async (request) => {
  const signinResponse = await supertokensCoreApi.POST('/appid-public/public/recipe/signin', {
    body: {
      email: request.email,
      password: request.password,
    },
  })

  if (signinResponse.data?.status !== "OK") {
    throw createBadCredentialsError('')
  }

  const userId = signinResponse.data.user.id

  const jwtResponse = await supertokensCoreApi.POST('/appid-public/recipe/jwt', {
    body: {
      payload: { userId } as never,
      algorithm: 'RS256' as const,
      jwksDomain: 'http://', // TODO
      useStaticSigningKey: true,
      validity: 3600, // TODO
    },
  })

  if (jwtResponse.data?.status !== "OK") {
    throw new Error("Failed to create JWT") // TODO: throw a more specific error
  }

  return { userId, userToken: jwtResponse.data.jwt }
}
