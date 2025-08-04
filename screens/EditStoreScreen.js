import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { StoresContext } from '../context/StoresContext';

const EditStoreScreen = ({ route, navigation }) => {
  const { storeId } = route.params;
  const { stores, editStore } = useContext(StoresContext);

  const [orbicoCode, setOrbicoCode] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [cashRegisterCount, setCashRegisterCount] = useState('');

  useEffect(() => {
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      setOrbicoCode(store.orbicoCode || '');
      setName(store.name || '');
      setCity(store.city || '');
      setCashRegisterCount(store.cashRegisterCount || '');
    }
  }, [storeId]);

  const handleSave = () => {
    if (!orbicoCode || !name || !city || !cashRegisterCount) {
      Alert.alert('Greška', 'Molimo popunite sva polja.');
      return;
    }

    editStore(storeId, {
      orbicoCode,
      name,
      city,
      cashRegisterCount,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Orbico code</Text>
        <TextInput
          style={styles.input}
          value={orbicoCode}
          onChangeText={setOrbicoCode}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Naziv</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Grad</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>Broj kasa</Text>
        <TextInput
          style={styles.input}
          value={cashRegisterCount}
          onChangeText={setCashRegisterCount}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Spremi promjene</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditStoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    alignSelf: 'center',
    width: 300,
  },
  saveButton: {
    backgroundColor: '#699bf8',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    alignSelf: 'center',
    width: 220,
    height: 44,
    marginBottom: 50,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
