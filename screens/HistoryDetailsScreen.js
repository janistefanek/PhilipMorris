import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HistoryDetailsScreen = ({ route }) => {
  const { item } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{item.store.name}</Text>

      <Text style={styles.label}>Orbico kod trgovine:</Text>
      <Text style={styles.value}>{item.store.orbicoCode}</Text>

      <Text style={styles.label}>Grad:</Text>
      <Text style={styles.value}>{item.store.city}</Text>

      <Text style={styles.label}>Ukupno napunjeno:</Text>
      <Text style={styles.value}>{item.ukupnoNapunjenih}</Text>

      <Text style={styles.label}>OOS na blagajnama:</Text>
      <Text style={styles.value}>
        {item.oosNaBlagajnama.length > 0
          ? item.oosNaBlagajnama.map((o) => o.replace(/_/g, ' ')).join(', ')
          : 'Nema'}
      </Text>

      <Text style={styles.label}>Generalni OOS:</Text>
      <Text style={styles.value}>
        {item.generalniOOS.length > 0
          ? item.generalniOOS.map((o) => o.replace(/_/g, ' ')).join(', ')
          : 'Nema'}
      </Text>

      <Text style={styles.label}>Datum:</Text>
      <Text style={styles.value}>{new Date(item.timestamp).toLocaleString()}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
    color: '#333',
  },
});

export default HistoryDetailsScreen;
