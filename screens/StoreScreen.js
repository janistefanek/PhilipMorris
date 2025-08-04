import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StoreScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Unos</Text>
    </View>
  );
};

export default StoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});
