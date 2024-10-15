import { useCallback, useState } from "react";
import { Button, View } from "react-native";
import { UITextInput } from "../shared/components/text-input";
import { useSession } from "../shared/hooks/use-session";
import { DefaultLayout } from "../shared/layouts/default-layout";

export const LoginPage = () => {
  const { emailProps, passwordProps, handleLogin } = useLoginForm();

  return <DefaultLayout>
    <View>
      <UITextInput placeholder="Email" {...emailProps} />
      <UITextInput placeholder="Password" {...passwordProps} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  </DefaultLayout>
};

const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useSession();

  const handleLogin = useCallback(() => {
    login({ email, password });
  }, [email, password, login]);

  return {
    emailProps: { value: email, onChangeText: setEmail },
    passwordProps: { value: password, onChangeText: setPassword },
    handleLogin,
  }
}
