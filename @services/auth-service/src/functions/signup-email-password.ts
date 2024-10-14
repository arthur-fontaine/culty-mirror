import type { AuthService } from "../../types/typescript"
import { supertokensCoreApi } from "../supertokens-core-api"
import { loginEmailPassword } from "./login-email-password"

export const signUpEmailPassword: AuthService["signUpEmailPassword"] = async (request) => {
  const signupResponse = await supertokensCoreApi.POST('/appid-{appId}/{tenantId}/recipe/signup', {
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

  if (signupResponse.data?.status !== "OK") {
    throw new Error("Failed to sign up") // TODO: throw a more specific error
  }

  return loginEmailPassword({
    email: request.email,
    password: request.password,
  })
}
