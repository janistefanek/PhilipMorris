import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { StoresContext } from '../context/StoresContext';

const AddStoreScreen = ({ navigation }) => {
  const [orbicoCode, setOrbicoCode] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [cashRegisterCount, setCashRegisterCount] = useState('');
  
  const { addStore } = useContext(StoresContext);

  useFocusEffect(
  useCallback(() => {
    setOrbicoCode('');
    setName('');
    setCity('');
    setCashRegisterCount('');
  }, [])
);

  const handleSave = () => {
    if (!orbicoCode || !name || !city || !cashRegisterCount) {
      Alert.alert('Greška', 'Molimo popunite sva polja');
      return;
    }

    addStore({
      orbicoCode,
      name,
      city,
      cashRegisterCount
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Orbico code :</Text>
        <TextInput
          style={styles.input}
          placeholder="Unesi unikatan broj trgovine"
          value={orbicoCode}
          onChangeText={setOrbicoCode}
        />

        <Text style={styles.label}>Naziv :</Text>
        <TextInput
          style={styles.input}
          placeholder="Unesi ime trgovine"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Grad :</Text>
        <TextInput
          style={styles.input}
          placeholder="Unesi grad u kojem se trgovina nalazi"
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>Broj kasa :</Text>
        <TextInput
          style={styles.input}
          placeholder="Unesi broj kasa u tom ducanu"
          value={cashRegisterCount}
          onChangeText={setCashRegisterCount}
          keyboardType="numeric"
        />
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Spremi Trgovinu</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    marginLeft:10,
  },
  input: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    alignSelf: 'center',
    width: 300,
  },
  saveButton: {
    backgroundColor: '#699bf8',
    padding: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    alignSelf: 'center',
    width: 220,
    height: 40,
    marginBottom: 190,

  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default AddStoreScreen;