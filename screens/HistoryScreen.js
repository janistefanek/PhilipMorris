import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

const HistoryScreen = () => {
  const [povijest, setPovijest] = useState([]);
  const openedSwipeableRef = useRef(null);
  const navigation = useNavigation();

  const loadPovijest = useCallback(async () => {
    try {
      const povijestRaw = await AsyncStorage.getItem('@povijest');
      if (povijestRaw) {
        const parsed = JSON.parse(povijestRaw);

        // Definiramo timestamp za 7 dana unazad
        const now = Date.now();
        const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

        // Filtriramo samo stavke novije ili jednake 7 dana
        const filtered = parsed.filter(item => {
          return new Date(item.timestamp).getTime() >= sevenDaysAgo;
        });

        // Ako ima starih zapisa, spremamo samo filtrirane (brisanje starih)
        if (filtered.length !== parsed.length) {
          await AsyncStorage.setItem('@povijest', JSON.stringify(filtered));
        }

        setPovijest(filtered);
      }
    } catch (e) {
      console.error('Greška pri učitavanju povijesti:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPovijest();
    }, [loadPovijest])
  );

  const obrisiZapis = async (indexToDelete) => {
    if (openedSwipeableRef.current) {
      openedSwipeableRef.current.close();
      openedSwipeableRef.current = null;
    }

    const originalIndex = povijest.length - 1 - indexToDelete;
    const novaPovijest = povijest.filter((_, index) => index !== originalIndex);

    setPovijest(novaPovijest);
    await AsyncStorage.setItem('@povijest', JSON.stringify(novaPovijest));
  };

  const renderRightActions = (progress, dragX, index) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={() => obrisiZapis(index)}>
        <View style={styles.deleteBox}>
          <Animated.Text style={[styles.deleteText, { transform: [{ scale }] }]}>
            Obriši
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, index }) => {
    let swipeableRef = null;

    return (
      <Swipeable
        ref={(ref) => (swipeableRef = ref)}
        onSwipeableOpen={() => {
          if (openedSwipeableRef.current && openedSwipeableRef.current !== swipeableRef) {
            openedSwipeableRef.current.close();
          }
          openedSwipeableRef.current = swipeableRef;
        }}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, index)
        }
      >
        <View style={styles.card}>
          <Text style={styles.title}>{item.store.name}</Text>
          <View style={styles.row}>
            <Text>Ukupno napunjeno : {item.ukupnoNapunjenih}</Text>
            <Text>Datum : {new Date(item.timestamp).toLocaleDateString()}</Text>
          </View>
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => navigation.navigate('HistoryDetails', { item })}
          >
            <Text style={styles.viewMoreText}>Prikaži više</Text>
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={povijest.slice().reverse()}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Još nema spremljenih podataka.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa', padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    alignSelf:'center',
    padding: 16,
    width:'95%',
    marginBottom:12,
    marginLeft:3,
    marginRight:3,
    elevation: 2,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewMoreButton: {
    backgroundColor: '#699bf8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  viewMoreText: {
    color: '#fff',
    fontSize: 12,
  },
  deleteBox: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 8,
    paddingHorizontal: 20,
    height: '100%',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HistoryScreen;
