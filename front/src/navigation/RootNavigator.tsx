import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Dialogs } from '../components/Dialogs';
import { Dialog } from '../components/Dialogs/Dialog';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#ffffff' },
      headerTintColor: '#5181b8',
      contentStyle: { backgroundColor: '#edeef0' },
    }}
  >
    <Stack.Screen
      name="Dialogs"
      component={Dialogs}
      options={{ title: 'Диалоги' }}
    />
    <Stack.Screen
      name="Dialog"
      component={Dialog}
      options={{ title: 'Сообщения' }}
    />
  </Stack.Navigator>
);
