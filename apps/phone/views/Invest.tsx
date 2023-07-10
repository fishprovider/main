import { StyleSheet } from 'react-native';

import Text from '~ui/Text';
import View from '~ui/View';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default function Invest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invest</Text>
    </View>
  );
}
