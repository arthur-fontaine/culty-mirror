import { useContext } from "react";
import { AuthContext } from "../contexts/auth-context";

interface UseSession {
  isLoading: boolean;
  login: (params: { email: string; password: string }) => void;
  token: string | undefined;
}

export const useSession = (): UseSession => {
  const { isLoading, login, token } = useContext(AuthContext);

  return { isLoading, login, token };
};
