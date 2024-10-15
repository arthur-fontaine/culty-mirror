import { Redirect, Slot } from 'expo-router';
import type React from 'react';
import 'react-native-reanimated';
import { useSession } from '../../shared/hooks/use-session';

export default function AuthLayout() {
  const { token } = useSession();

  if (token === undefined) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}
