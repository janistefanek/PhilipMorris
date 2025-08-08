import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HistoryDetailsScreen = ({ route, navigation }) => {
  const item = route?.params?.item;

  if (!item) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 16, marginBottom: 20 }}>Nema podataka za prikaz.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Nazad</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCopy = async (value) => {
    await Clipboard.setStringAsync(value.toString());
  };

  const renderValueRow = (value) => (
    <View style={styles.valueRow}>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity onPress={() => handleCopy(value)}>
        <Ionicons name="copy-outline" size={20} color="#699bf8" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{item.store.name}</Text>

      <Text style={styles.label}>Orbico kod trgovine:</Text>
      {renderValueRow(item.store.orbicoCode)}

      <Text style={styles.label}>Grad:</Text>
      {renderValueRow(item.store.city)}

      <Text style={styles.label}>Ukupno napunjeno:</Text>
      {renderValueRow(item.ukupnoNapunjenih)}

      <Text style={styles.label}>OOS na blagajnama:</Text>
      {renderValueRow(
        item.oosNaBlagajnama.length > 0
          ? item.oosNaBlagajnama.map((o) => o.replace(/_/g, ' ')).join(', ')
          : 'Nema'
      )}

      <Text style={styles.label}>Generalni OOS:</Text>
      {renderValueRow(
        item.generalniOOS.length > 0
          ? item.generalniOOS.map((o) => o.replace(/_/g, ' ')).join(', ')
          : 'Nema'
      )}

      <Text style={styles.label}>Datum:</Text>
      {renderValueRow(new Date(item.timestamp).toLocaleString())}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Zatvori</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fafafa',
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    fontSize: 16,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 12,
    marginLeft: 15,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  backButton: {
    backgroundColor: '#699bf8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '60%',
    height: '6%',
    marginTop: 130,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 12,
  },
});

export default HistoryDetailsScreen;
