import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SlaganjeScreen = ({ route, navigation }) => {
  const { adjustedCounts, store, allKasaCounts } = route.params;

  if (!adjustedCounts || !allKasaCounts) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Greška: nedostaju podaci za slaganje.</Text>
      </View>
    );
  }

  const totalKasa = Object.keys(allKasaCounts).length;
  const raspodjela = {};
  const preostalo = { ...adjustedCounts };

  for (let kasaIndex = 0; kasaIndex < totalKasa; kasaIndex++) {
    const kasaKey = `Kasa ${kasaIndex + 1}`;
    const kasaCounts = allKasaCounts[kasaIndex];
    raspodjela[kasaKey] = [];

    for (const [productKey, fali] of Object.entries(kasaCounts)) {
      if (fali <= 0 || preostalo[productKey] <= 0) continue;

      const zaDodati = Math.min(fali, preostalo[productKey]);
      if (zaDodati > 0) {
        raspodjela[kasaKey].push({
          productKey,
          naziv: productKey.replace(/_/g, ' '),
          kolicina: zaDodati,
        });
        preostalo[productKey] -= zaDodati;
      }
    }
  }

  const sviProizvodi = Object.keys(adjustedCounts);

  const oosNaBlagajnama = sviProizvodi.filter((productKey) =>
    Object.values(allKasaCounts).every((kasa) => kasa[productKey] > 0)
  );

  const generalniOOS = oosNaBlagajnama.filter((productKey) => adjustedCounts[productKey] === 0);

  const ukupnoNapunjenih = Object.values(raspodjela).flat().reduce((acc, { kolicina }) => acc + kolicina, 0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Slaganje',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#fafafa',
        height: 100,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        fontSize: 24,
        fontWeight: 'bold',
      },
    });
  }, [navigation]);

  const handleSpremi = async () => {
    try {
      const now = new Date();
      const zapis = {
        store,
        ukupnoNapunjenih,
        oosNaBlagajnama,
        generalniOOS,
        timestamp: now.toISOString(),
      };

      const povijestRaw = await AsyncStorage.getItem('@povijest');
      const povijest = povijestRaw ? JSON.parse(povijestRaw) : [];

      povijest.push(zapis);

      await AsyncStorage.setItem('@povijest', JSON.stringify(povijest));

      navigation.navigate('Povijest');
    } catch (e) {
      console.error('Greška pri spremanju povijesti:', e);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          {Object.entries(raspodjela).map(([kasaName, proizvodi]) => (
            <View key={kasaName} style={styles.kasaSection}>
              <Text style={styles.kasaTitle}>{kasaName}</Text>
              {proizvodi.map(({ naziv, kolicina }) => (
                <View key={naziv} style={styles.row}>
                  <View style={styles.bullet} />
                  <Text style={styles.productName}>{naziv}</Text>
                  <Text style={styles.amount}>{kolicina}</Text>
                </View>
              ))}
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.total}>Ukupno napunjeno:</Text>
            <View style={styles.totalBox}>
              <Text style={styles.totalBoxText}>{ukupnoNapunjenih}</Text>
            </View>
          </View>

          {/* Centered heading for OOS na blagajnama */}
          <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>OOS na blagajnama</Text>
          </View>
          {/* Box with missing items below heading, left aligned */}
          <View style={[styles.totalBox, { alignSelf: 'center', minWidth: 210, alignItems: 'flex-start' }]}>
            {oosNaBlagajnama.length > 0
              ? oosNaBlagajnama.map((c, index) => (
                  <View key={index} style={styles.oosItemRow}>
                    <View style={styles.oosBullet} />
                    <Text style={styles.oosItem}>{c.replace(/_/g, ' ')}</Text>
                  </View>
                ))
              : <Text style={styles.oosItem}>Nema</Text>}
          </View>

          {/* Centered heading for Generalni OOS */}
          <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Generalni OOS</Text>
          </View>
          {/* Box with missing items below heading, left aligned */}
          <View style={[styles.totalBox, { alignSelf: 'center', minWidth: 210, alignItems: 'flex-start' }]}>
            {generalniOOS.length > 0
              ? generalniOOS.map((c, index) => (
                  <View key={index} style={styles.oosItemRow}>
                    <View style={styles.oosBullet} />
                    <Text style={styles.oosItem}>{c.replace(/_/g, ' ')}</Text>
                  </View>
                ))
              : <Text style={styles.oosItem}>Nema</Text>}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSpremi}>
          <Text style={styles.saveButtonText}>Spremi</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  kasaSection: {
    marginBottom: 25,
  },
  kasaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#699bf8',
    marginRight: 8,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  total: {
    fontSize: 16,
    color: '#666',
    flexShrink: 1,
  },
  totalBox: {
    backgroundColor: '#fafafa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  totalBoxText: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  saveButton: {
    backgroundColor: '#699bf8',
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '#fafafa',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  oosContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  oosItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginTop:2,
    paddingLeft: 20,
  },
  oosBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#699bf8',
    marginRight: 8,
  },
  oosItem: {
    color: '#333',
    fontSize:12,
    flexShrink: 1,
  },
});

export default SlaganjeScreen;