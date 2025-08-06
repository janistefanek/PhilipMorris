import React, { useState, useLayoutEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const products = {
  Marlboro: ['Red 23s', 'Red', 'Gold 23s', 'Gold', 'Gold 100s', 'Touch', 'Fine Touch', 'Red Touch', 'Line Gold', 'Line Blue'],
  Chesterfield: ['Original', 'Original 100s', 'Blue', 'Blue 100s', 'Silver 100s', 'Tuned Blue', 'Tuned Blue XL', 'Tuned Aqua', 'Tuned Aqua XL', 'Linea Blue', 'Linea Rose'],
  Philip_Morris: ['Blue', 'Supreme'],
  Terea: ['Russet', 'Bronze', 'Sienna', 'Teak', 'Amber', 'Yellow', 'Silver', 'Turquoise', 'Soft Fuze', 'Willow', 'Mauve'],
  Fiit: ['Regular Copper', 'Regular', 'Regular Stone', 'Regular Sky', 'Element Stream']
};

const CounterScreen = ({ route, navigation }) => {
  const { store, kasaIndex, totalKasa } = route.params;

  const allKasaCountsRef = useRef(route.params.allKasaCounts || {});

  const [counts, setCounts] = useState(() => {
    const stored = allKasaCountsRef.current[kasaIndex];
    if (stored) return stored;

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
        backgroundColor: '#fafafa',
      }
    });
  }, [navigation, store.name, kasaIndex]);

  const handleCount = (key, delta) => {
    setCounts(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta)
    }));
  };

  const resetCounts = () => {
    const reset = {};
    Object.entries(products).forEach(([brand, variants]) => {
      variants.forEach(variant => {
        const key = `${brand}_${variant}`;
        reset[key] = 0;
      });
    });
    setCounts(reset);
  };

  const saveCurrentKasa = () => {
    allKasaCountsRef.current = {
      ...allKasaCountsRef.current,
      [kasaIndex]: counts,
    };
  };

  const goToNextKasa = () => {
    saveCurrentKasa();
    if (kasaIndex + 1 < totalKasa) {
      navigation.push('Counter', {
        store,
        kasaIndex: kasaIndex + 1,
        totalKasa,
        allKasaCounts: allKasaCountsRef.current,
      });
    }
  };

  const goToPrevKasa = () => {
    saveCurrentKasa();
    if (kasaIndex > 0) {
      navigation.goBack();
    }
  };

  const finishAndNavigate = () => {
    saveCurrentKasa();

    const totalCounts = {};
    Object.entries(products).forEach(([brand, variants]) => {
      variants.forEach(variant => {
        const key = `${brand}_${variant}`;
        totalCounts[key] = 0;
      });
    });

    Object.values(allKasaCountsRef.current).forEach(kasaCounts => {
      Object.entries(kasaCounts).forEach(([key, val]) => {
        totalCounts[key] = (totalCounts[key] || 0) + val;
      });
    });

    navigation.navigate('Skladiste', { totalCounts, store });
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

  return (
    <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Counter</Text>
        <TouchableOpacity onPress={resetCounts} style={styles.resetButton}>
          <MaterialIcons name='restart-alt' size={30} />
        </TouchableOpacity>
      </View>

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

          {kasaIndex + 1 === totalKasa ? (
            <TouchableOpacity
              onPress={finishAndNavigate}
              style={styles.finishButton}
            >
              <Text style={{ color: 'white' }}>Završi</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={goToNextKasa} style={styles.nextButton}>
              <Text style={{ color: 'white' }}>Sljedeća kasa</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 20,
    backgroundColor: '#fafafa',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  finishButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  resetButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 0,
    color: '#333',
    marginLeft: 20,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 10,
  },
  counterContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    height: 100,
    alignItems: 'center',
    marginBottom: 6,
    elevation: 2,
    shadowOffset: { width: 3, height: 3 },
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
    justifyContent: 'center',
    width: '100%',
  },
  minus: {
    backgroundColor: '#fdd',
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    backgroundColor: '#dfd',
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
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
