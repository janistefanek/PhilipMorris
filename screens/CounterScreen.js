import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const products = {
  Marlboro: [ 'Red 23s', 'Red', 'Gold 23s', 'Gold', 'Gold 100s', 'Touch', 'Fine Touch', 'Red Touch', 'Line Gold', 'Line Blue'],
  Chesterfield: ['Original', 'Original 100s', 'Blue', 'Blue 100s', 'Silver 100s', 'Tuned Blue', 'Tuned Blue XL', 'Tuned Aqua', 'Tuned Aqua XL', 'Linea Blue', 'Linea Rose'],
  PhilipMorris: ['Blue', 'Supreme'],
  Terea: ['Russet', 'Bronze', 'Sienna', 'Teak', 'Amber', 'Yellow', 'Silver', 'Turquoise', 'Soft Fuze', 'Willow', 'Mauve'],
  Fits: ['Regular Copper', 'Regular', 'Regular Stone', 'Regular Sky', 'Element Stream']
};

const CounterScreen = ({ route, navigation }) => {
  const { store, kasaIndex, totalKasa } = route.params;

  const [counts, setCounts] = useState(() => {
    const initial = {};
    Object.entries(products).forEach(([brand, variants]) => {
      variants.forEach(variant => {
        const key = `${brand}_${variant}`;
        initial[key] = 0;
      });
    });
    return initial;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${store.name} - Kasa ${kasaIndex + 1}`,
      headerTitleAlign: 'center',
      headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            height: 120,
            backgroundColor: '#fafafa',}
    
    });
  }, [navigation, store.name, kasaIndex]);

  const handleCount = (key, delta) => {
    setCounts(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta)
    }));
  };

  const renderCounter = (brand, variant) => {
    const key = `${brand}_${variant}`;
    return (
      <View style={styles.counterContainer} key={key}>
        <Text style={styles.label}>{variant}</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => handleCount(key, -1)} style={styles.minus}>
            <Text style={styles.controlText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.count}>{counts[key]}</Text>
          <TouchableOpacity onPress={() => handleCount(key, 1)} style={styles.plus}>
            <Text style={styles.controlText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const goToNextKasa = () => {
    if (kasaIndex + 1 < totalKasa) {
      navigation.push('Counter', {
        store,
        kasaIndex: kasaIndex + 1,
        totalKasa
      });
    }
  };

  const goToPrevKasa = () => {
    if (kasaIndex > 0) {
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(products).map(([brand, variants]) => (
        <View key={brand}>
          <Text style={styles.brandTitle}>{brand}</Text>
          <View style={styles.row}>
            {variants.map(variant => renderCounter(brand, variant))}
          </View>
        </View>
      ))}
      <View style={styles.buttonsRow}>
        <TouchableOpacity onPress={goToPrevKasa} style={styles.prevButton}>
          <Text>Prethodna kasa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextKasa} style={styles.nextButton}>
          <Text style={{ color: 'white' }}>Sljedeća kasa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: '#fafafa',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft:15,
    marginRight:15,
    gap: 16,
  },
  counterContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: 150,
    height: 100,
    alignItems: 'center',
    marginBottom: 6,
    elevation: 2,
    elevation:2,
    shadowOffset:3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    
  },
  label: {
    marginBottom: 6,
    color: 'black',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minus: {
    backgroundColor: '#fdd',
    padding: 8,
    borderRadius: 6,
  },
  plus: {
    backgroundColor: '#dfd',
    padding: 8,
    borderRadius: 6,
  },
  count: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  controlText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    paddingHorizontal: 10,
  },
  prevButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '45%',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#699bf8',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
});

export default CounterScreen;
