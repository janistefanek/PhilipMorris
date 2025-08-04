import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const StoresContext = createContext();

export const StoresProvider = ({ children }) => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const loadStores = async () => {
      try {
        const savedStores = await AsyncStorage.getItem('@stores');
        if (savedStores) {
          setStores(JSON.parse(savedStores));
        }
      } catch (e) {
        console.error('Greška pri učitavanju trgovina:', e);
      }
    };

    loadStores();
  }, []);

  useEffect(() => {
    const saveStores = async () => {
      try {
        await AsyncStorage.setItem('@stores', JSON.stringify(stores));
      } catch (e) {
        console.error('Greška pri spremanju trgovina:', e);
      }
    };

    saveStores();
  }, [stores]);

  const addStore = (newStore) => {
    setStores(prev => [
      ...prev,
      {
        ...newStore,
        id: Date.now().toString(),
      },
    ]);
  };

  const editStore = (storeId, updatedStoreData) => {
    setStores(prevStores =>
      prevStores.map(store =>
        store.id === storeId
          ? { ...store, ...updatedStoreData }
          : store
      )
    );
  };

  const deleteStore = (storeId) => {
    setStores(prevStores => prevStores.filter(store => store.id !== storeId));
  };

  return (
    <StoresContext.Provider value={{ stores, addStore, editStore, deleteStore }}>
      {children}
    </StoresContext.Provider>
  );
};
