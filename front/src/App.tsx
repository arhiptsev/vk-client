import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DbProvider, useDb } from './db/DbContext';
import { RootNavigator } from './navigation/RootNavigator';

const AppContent = () => {
  const { ready, error } = useDb();

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Ошибка базы данных</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5181b8" />
        <Text style={styles.loadingText}>Открываем SQLite…</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <DbProvider>
        <AppContent />
      </DbProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#edeef0',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#818c99',
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#818c99',
    textAlign: 'center',
    lineHeight: 20,
  },
});
