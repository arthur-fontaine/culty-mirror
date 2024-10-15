import { authService } from '@culty/services';
import { HTTPError } from 'agrume/errors'

export function withAuth<
  T extends (arg: P & { userId: string }) => Promise<R>,
  P = Parameters<T>[0],
  R = Awaited<ReturnType<T>>
>(fn: T) {
  const newFn = async (arg: Omit<P, 'userId'> & { userToken: string }) => {
    const [accessToken, antiCsrfToken] = arg.userToken.split(" ");
    if (!accessToken || !antiCsrfToken) {
      throw HTTPError.Unauthorized("Invalid user token");
    }
    const { userId } = await authService.verifyAccessToken({ accessToken, antiCsrfToken });
    return await fn({ ...arg, userId } as never);
  }
  Object.defineProperty(newFn, 'name', { value: fn.name });
  return newFn;
}
