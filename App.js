import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import AddStoreScreen from './screens/AddStoreScreen';
import EditStoreScreen from './screens/EditStoreScreen';
import StoreScreen from './screens/StoreScreen';
import HistoryScreen from './screens/HistoryScreen';
import { StoresProvider } from './context/StoresContext';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import CounterScreen from './screens/CounterScreen';
import SkladisteScreen from './screens/SkladisteScreen';
import SlaganjeScreen from './screens/SlaganjeScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function defaultHeaderOptions(title) {
  return {
    title,
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      height: 120,
      backgroundColor: '#fafafa',
    },
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontSize: 25,
      fontWeight: 'bold',
    },
  };
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'Moje trgovine',
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            height: 120,
            backgroundColor: '#fafafa',
          },
          headerTitleAlign: 'left',
          headerTitleStyle: {
            marginLeft: 30,
            fontSize: 32,
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen name="Dodaj" component={AddStoreScreen} options={defaultHeaderOptions('Dodaj Trgovinu')} />
      <Stack.Screen name="Uredi" component={EditStoreScreen} options={defaultHeaderOptions('Uredi Trgovinu')} />
      <Stack.Screen name = "Unos" component={StoreScreen} options={defaultHeaderOptions('Unos')} />
      <Stack.Screen name="Counter" component={CounterScreen} options={{ headerBackTitle: 'Back' }} />
      <Stack.Screen name="Skladiste" component={SkladisteScreen} />
      <Stack.Screen name="Slaganje" component={SlaganjeScreen} options={{ ...defaultHeaderOptions('Slaganje'),headerBackTitle: 'Back'}}/>
    </Stack.Navigator>
  );
}

function StoreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="UnosScreen" 
        component={StoreScreen} 
        options={{
          title: 'Unos',
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            height: 120,
            backgroundColor: '#fafafa',
              },
          headerTitleAlign: 'left',
          headerTitleStyle: {
            marginLeft: 30,
            fontSize: 32,
            fontWeight: 'bold',
              },

        }} />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} options={{
          title: 'Povijest',
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            height: 120,
            backgroundColor: '#fafafa',
              },
          headerTitleAlign: 'left',
          headerTitleStyle: {
            marginLeft: 30,
            fontSize: 32,
            fontWeight: 'bold',
              },

        }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <StoresProvider>
      <ActionSheetProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;

                if (route.name === 'Trgovine') iconName = 'home';
                else if (route.name === 'Povijest') iconName = 'back-in-time';

                return <Entypo name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#699bf8',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen name="Trgovine" component={HomeStack} />
            <Tab.Screen name="Povijest" component={HistoryStack} />
            
          </Tab.Navigator>
        </NavigationContainer>
      </ActionSheetProvider>
    </StoresProvider>
  );
}
