import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import { Text } from '@/components/common/Text';
import { txStyles } from '../constants/Typography';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text variant='title' style={txStyles.title}>This screen doesn't exist.</Text>
        <Link href="/watchlist" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  }, 
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    ...txStyles.subtitle,
    color: '#2e78b7',
  },
});
