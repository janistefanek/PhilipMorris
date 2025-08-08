import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const SkladisteScreen = ({ route, navigation }) => {
  const { totalCounts, store } = route.params || {};

  const [adjustedCounts, setAdjustedCounts] = useState({});
  const [missingNotTaken, setMissingNotTaken] = useState([]);

  useEffect(() => {
    if (totalCounts) {
      const filteredCounts = Object.fromEntries(
        Object.entries(totalCounts).filter(([_, val]) => val > 0)
      );
      setAdjustedCounts(filteredCounts);
    }
  }, [totalCounts]);

  const staticTotal = totalCounts
    ? Object.values(totalCounts).reduce((acc, val) => acc + val, 0)
    : 0;

  const dynamicTotal = Object.values(adjustedCounts).reduce((acc, val) => acc + val, 0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${store ? store.name : 'Skladište'}`,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#fafafa',
        height: 100,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
      },
    });
  }, [navigation, store]);

  const handleAdjust = (key, delta) => {
    setAdjustedCounts(prev => {
      const newValue = Math.max(0, (prev[key] || 0) + delta);
      return { ...prev, [key]: newValue };
    });
  };

  const NavigateToSlaganje = () => {
    navigation.navigate('Slaganje', {
      adjustedCounts,
      store,
      allKasaCounts: route.params?.allKasaCounts || {},
    });
  };

  const getListData = (data) => {
    return Object.entries(data)
      .map(([key, value]) => ({
        key,
        name: key.replace(/_/g, ' '),
        value,
      }));
  };

  const listData = getListData(adjustedCounts);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>Ukupno</Text>

      <View style={styles.card}>
        <Text style={styles.totalNumber}>{staticTotal}</Text>
        <Text style={styles.totalLabel}>Potreban broj šteka</Text>
      </View>

      <View style={[styles.card, styles.listContainer]}>
        <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled>
          {listData.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Nema podataka za prikaz
            </Text>
          ) : (
            listData.map(({ key, name, value }) => (
              <View key={key} style={styles.itemRow}>
                <Text style={styles.variantName} numberOfLines={1} ellipsizeMode="tail">
                  {name}
                </Text>
                <View style={styles.adjustContainer}>
                  <TouchableOpacity
                    style={[styles.adjustButton, { backgroundColor: '#F8D7DA' }]}
                    onPress={() => handleAdjust(key, -1)}
                  >
                    <Text style={styles.adjustText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.adjustCount}>{value}</Text>
                  <TouchableOpacity
                    style={[styles.adjustButton, { backgroundColor: '#D4EDDA' }]}
                    onPress={() => handleAdjust(key, 1)}
                  >
                    <Text style={styles.adjustText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <View style={styles.card}>
        <Text style={styles.totalNumber}>{dynamicTotal}</Text>
        <Text style={styles.totalLabel}>Ukupno uzeto iz skladišta</Text>
      </View>

      {missingNotTaken.length > 0 && (
        <View style={[styles.card, styles.listContainer]}>
          <Text style={styles.listHeading}>Fale na svim kasama, ali nisu uzete:</Text>
          {missingNotTaken.map(key => (
            <Text key={key} style={styles.variantName}>
              {key.replace(/_/g, ' ')}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={NavigateToSlaganje}>
        <Text style={styles.buttonText}>Slaganje po kasama</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  totalNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  totalLabel: {
    marginTop: 6,
    fontSize: 14,
    color: '#444',
  },
  listContainer: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  listHeading: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  variantName: {
    fontSize: 14,
    color: 'black',
    flex: 1,
    marginBottom: 4,
  },
  adjustContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adjustButton: {
    width: 28,
    height: 28,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
  },
  adjustCount: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: '600',
    width: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SkladisteScreen;
