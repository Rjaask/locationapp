import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Button } from 'react-native';
import TodoItem from './components/ItemPage';
import { Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import LocationScreen from './components/LocationsPage';
import MapScreen from './components/MapPage';
const Stack = createStackNavigator();

function HomeScreen({ route, navigation }) {
  const [items, setItems] = useState([]);

  const getItems = () => {
    AsyncStorage.getItem('locations')
      .then(json => {
        const itemList = json ? JSON.parse(json) : [];
        setItems(itemList);
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    getItems();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getItems();
    }, [])
  );
  useEffect(() => {
    if (route.params?.newLocation) {
      const updatedItems = [...items, route.params.newLocation];
      setItems(updatedItems);
      AsyncStorage.setItem('locations', JSON.stringify(updatedItems));
    }
  }, [route.params?.newLocation]);

  const goToAddLocationScreen = () => {
    navigation.navigate('AddLocation');
  };

  const goToMapScreen = (location) => {
    navigation.navigate('MapScreen', { location });  
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem('locations');
      setItems([]); 
      Alert.alert('AsyncStorage Cleared', 'All locations have been removed.');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Add Location" onPress={goToAddLocationScreen} />
      <Button title="Clear All Locations" onPress={clearAsyncStorage} />
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <TodoItem
            text={item.name}
            description={item.description}
            rating={item.rating}
            onPress={() => goToMapScreen(item)} 
          />
        )}
        ItemSeparatorComponent={() => <Divider bold={true} />}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddLocation" component={LocationScreen} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CEC2C2',
    padding: 25,
    gap: 10,
  },
});