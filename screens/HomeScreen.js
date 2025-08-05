import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet,Alert } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { StoresContext } from '../context/StoresContext';
import { useActionSheet } from '@expo/react-native-action-sheet';
import {StoreScreen} from '../screens/StoreScreen';

const HomeScreen = ({ navigation }) => {
  const { stores, deleteStore, editStore, } = useContext(StoresContext);
  const { showActionSheetWithOptions } = useActionSheet();

  const handleStorePress = (store) => {
   console.log("store pressed")
   navigation.navigate('Counter', {
      store,
      kasaIndex: 0,
      totalKasa: parseInt(store.cashRegisterCount),
      });
  };

  const handleDotsPress = (storeId) => {
    const options = ['Uredi', 'Obriši', 'Otkaži'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex,
      destructiveButtonIndex,
      title: 'Izaberite opciju',
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        navigation.navigate('Uredi', { storeId });
      } else if (buttonIndex === 1) {
        Alert.alert(
          'Potvrda brisanja',
          'Jeste li sigurni da želite obrisati ovu trgovinu?',
          [
            {
              text: 'Otkaži',
              style: 'cancel',
            },
            {
              text: 'Obriši',
              style: 'destructive',
              onPress: () => {
                deleteStore(storeId);
              },
            },
          ],
          { cancelable: true }
        );
      }
    }
  );
  };

  return (
    <View style={styles.container}>
      {stores.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="storefront-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>Nemate dodanih trgovina</Text>
          <Text style={styles.emptyStateSubtext}>Dodajte svoju prvu trgovinu</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={true}>
          {stores.map((store) => (
            <TouchableOpacity
              key={store.id}
              style={styles.storeCard}
              onPress={() => handleStorePress(store)}
            >
              <Text style={styles.storeName}>{store.name}</Text>

              <View style={styles.iconContainer}>
                <Ionicons name="chevron-forward" size={20} color="#699bf8" style={styles.icon} />

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDotsPress(store.id);
                  }}
                >
                  <Entypo name="dots-three-vertical" size={20} color="#699bf7"/>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Dodaj')}>
        <Text style={styles.addButtonText}>Dodaj Trgovinu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 10,
  },
  storeName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#699bf8',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginBottom: 15,
    alignSelf: 'center',
    width: 300,
    height: 40,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#555',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: 250,
    alignItems: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
});

export default HomeScreen;
