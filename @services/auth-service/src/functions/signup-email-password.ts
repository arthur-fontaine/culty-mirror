import type { AuthService, IBadCredentials } from "../../types/typescript"
import { supertokensCoreApi } from "../supertokens-core-api"
import { loginEmailPassword } from "./login-email-password"

export const signUpEmailPassword: AuthService["signUpEmailPassword"] = async (request) => {
  const signupResponse = await supertokensCoreApi.POST('/appid-public/public/recipe/signup', {
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
